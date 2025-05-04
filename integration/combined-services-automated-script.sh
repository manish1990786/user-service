#!/bin/bash

# Check if Docker is running
echo "Checking Docker status..."
if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Attempting to start Docker Desktop..."
  powershell.exe -Command "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe' -Verb RunAs"
  echo "Waiting for Docker Desktop to start..."
  while ! docker info >/dev/null 2>&1; do
    sleep 2
  done
  echo "Docker started successfully."
else
  echo "Docker is already running."
fi

# Down Docker Compose services
echo "Down docker-compose services..."
docker compose down


echo "Running docker-compose services..."
docker compose up -d

# Start Minikube only if not already running
minikube_status=$(minikube status -o json 2>/dev/null || echo "{}")
minikube_running=$(echo "$minikube_status" | jq -r '.Host == "Running" and .Kubelet == "Running" and .APIServer == "Running" and .Kubeconfig == "Configured"' 2>/dev/null || echo "false")

if [ "$minikube_running" != "true" ]; then
  echo "Minikube is not properly running. Attempting repair..."
  minikube delete >/dev/null 2>&1 || true
  echo "Starting Minikube..."
  minikube start --driver=docker
else
  echo "Minikube is already running properly"
fi

# Get Minikube port
minikube_port=$(grep -oP 'server: https:\/\/127\.0\.0\.1:\K\d+' "$HOME/.kube/config")

# Update project kubeconfig port
if [ -n "$minikube_port" ] && [ -f "$HOME/workplace/user-service/.kube/config" ]; then
  sed -i "s#server: \(https:\/\/.*\):\([0-9]*\)#server: \1:$minikube_port#g" "$HOME/workplace/user-service/.kube/config"
  echo "Updated project kubeconfig port to $minikube_port"
else
  echo "Error: Could not get Minikube port or project kubeconfig not found."
fi


# Apply the YAML file to deploy services
echo "Applying Kubernetes YAML files..."
kubectl delete -f ./integration/combined-services.yaml  --ignore-not-found
kubectl apply -f ./integration/combined-services.yaml 

# Wait for services to be deployed
echo "Waiting for pods to be ready..."
kubectl rollout status deployment/user-service
kubectl rollout status deployment/order-service
kubectl rollout status deployment/product-service
kubectl rollout status deployment/payment-service

# Verify deployment and service status
echo "Checking deployed pods and services..."
kubectl get pods
kubectl get services

# Check if the ports are already in use and kill the processes
powershell -Command "foreach (\$port in 3001,3002,3003,3004) { try { Stop-Process -Id (Get-NetTCPConnection -LocalPort $port -ErrorAction Stop).OwningProcess -Force } catch {} }"

# Mapping port:
echo "Port mapping for services..."
kubectl port-forward svc/user-service 3001:3001 > /dev/null 2>&1 &
kubectl port-forward svc/order-service 3002:3002 > /dev/null 2>&1 &
kubectl port-forward svc/product-service 3004:3004 > /dev/null 2>&1 &
kubectl port-forward svc/payment-service 3003:3003 > /dev/null 2>&1 &

echo "Deployment completed successfully!"
