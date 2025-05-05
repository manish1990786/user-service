# User Service

A robust and scalable microservice for managing users, built with an event-driven architecture. It includes full user lifecycle features, JWT-based authentication, and Kafka event publishing, and is ready for production with Docker, Kubernetes, and CI/CD integration.

## Features

- **User Registration & Authentication** – Secure sign-up and login with hashed passwords.
- **JWT-based Authorization** – Protect endpoints with access tokens.
- **Profile Management** – CRUD operations for user profiles.
- **Kafka Integration** – Publishes events on user actions.
- **MongoDB Integration** – Stores user data in a NoSQL database.
- **Dockerized** – Seamless containerization for local and cloud deployments.
- **Kubernetes Ready** – Deployable with manifests.
- **CI/CD with Jenkins** – Automated testing and deployment pipeline.
- **Health Check Endpoint** – Monitor service status easily.
- **Extensible Codebase** – Clean architecture for scalability.

## Architecture

![scalable-services-assignment](https://github.com/user-attachments/assets/ed02e02c-028e-4cba-84a3-96af69f50516)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Event Streaming**: Apache Kafka
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Kubernetes (Minikube for local development)
- MongoDB
- Apache Kafka

## Installation

1. Clone the repository:
```bash
git clone https://github.com/manish1990786/user-service.git
cd user-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following:
```env
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin
ME_CONFIG_MONGODB_ADMINUSERNAME=admin
ME_CONFIG_MONGODB_ADMINPASSWORD=admin
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=admin
MONGODB_URI=mongodb://admin:admin@host.docker.internal:27017
KAFKA_BROKERS=host.docker.internal:9092
JWT_SECRET=JWTkey123!
KAFKAJS_NO_PARTITIONER_WARNING=1
DOCKER_USERNAME=your-docker-user-name
DOCKER_PASSWORD=your-docker-token
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your-github-token
```

## Running the Application

### Using Docker Compose

Start all services:
```bash
docker-compose up -d
```

Stop all services:
```bash
docker-compose down
```

This will start:
- MongoDB (port 27017)
- Mongo Express UI (port 8083)
- Kafka (port 9092)
- Kafka UI (port 8082)
- Jenkins (ports 8085, 50000)

### Running Locally

Start the service:
```bash
npm start
```

Run tests:
```bash
npm test
```

## API Endpoints

### Public Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Protected Routes (requires authentication)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `GET /api/users/verify-token` - Verify JWT token
- `GET /api/users/logout` - User logout

## Kubernetes Deployment

Deploy to Kubernetes cluster:
```bash
kubectl apply -f user-service.yaml
```

## Health Check

Service health can be monitored at:
```
GET /health
```

## Event Publishing

The service publishes the following events to Kafka:
- USER_CREATED
- USER_UPDATED
- USER_DELETED

## CI/CD Pipeline (Jenkins)

The Jenkins pipeline automates the following steps:

1. **Checkout repository** – Pulls the latest code from the GitHub repository.
2. **Install dependencies** – Runs `npm install` to install required packages.
3. **Run unit tests** – Executes `npm test` to validate the code.
4. **Build Docker image** – Creates a Docker image for the application.
5. **Push to Docker Hub** – Uploads the image to a configured Docker registry.
6. **Deploy to Kubernetes** – Applies the Kubernetes manifests to update the live deployment.

### Useful Commands

#### Minikube

```bash
minikube start --driver=docker          # Start Minikube with Docker driver
minikube stop                           # Stop Minikube
minikube delete --all                   # Delete all Minikube clusters
minikube dashboard                      # Launch Minikube dashboard in browser
minikube status                         # View Minikube status
minikube ip                             # Get the Minikube IP address
minikube service user-service           # Access the user-service via Minikube
```


#### Kubernetes (kubectl)

```bash
kubectl get pods                        # List all pods
kubectl delete service user-service     # Delete the user-service
kubectl delete deployment user-service  # Delete the user-service deployment
kubectl port-forward svc/user-service 3001:3001  # Forward port for local access
kubectl logs user-service-6bf448f49-fqkcb        # View logs of specific pod
kubectl exec -it user-service-6bf448f49-fqkcb -- /bin/bash  # Enter pod shell
```

#### Debug inside Container

```bash
apt-get update && apt-get install -y netcat  # Install netcat inside container
nc -zv localhost 9092                        # Check Kafka port connectivity
```

#### Docker

```bash
- `docker ps` # List running containers  
- `docker ps -a`  #  List all containers (including stopped)  
- `docker run -d -p 3001:3001 --name user-service user-service`  #  Run a container in detached mode  
- `docker stop user-service` # Stop a running container  
- `docker rm user-service`  #  Remove a stopped container  
- `docker logs user-service`  # View logs of a container  
- `docker exec -it user-service /bin/bash`  #  Access shell inside running container
- `docker build -t user-service .`  # Build Docker image from Dockerfile  
- `docker tag user-service manish1990786/user-service:latest`  # Tag an image for Docker Hub  
- `docker push manish1990786/user-service:latest`  # Push image to Docker Hub  
- `docker pull manish1990786/user-service:latest`  # Pull image from Docker Hub  
- `docker rmi user-service`  # Remove a local image
- `docker network inspect my-network` #  Inspect a specific network  
- `docker network create my-network`  #  Create a custom network
- `docker network rm my-network`  #  Remove a custom Docker network
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/next-feature`)
5. Open a Pull Request
