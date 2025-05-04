pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        dockerTool 'Docker'
    }

    environment {
        DOCKER_IMAGE = "manish1990786/user-service:latest"
        KUBE_DEPLOYMENT = "user-service.yaml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    def branchName = env.BRANCH_NAME ?: 'main'
                    echo "Building branch: ${branchName}"
                    git branch: branchName, url: 'https://github.com/manish1990786/user-service'
                }
            }
        }

        stage('Build') {
            steps {
                retry(2) {
                    script {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh 'npm test --runInBand --forceExit'
                }
            }
        }

        stage('Retrieve .env from Jenkins') {
            steps {
                withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE .env'
                    sh 'cat .env'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                retry(2) {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "docker build -t ${DOCKER_IMAGE} ."
                            sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
                            sh "docker push ${DOCKER_IMAGE}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            // when { expression { env.BRANCH_NAME == 'test' } }
            steps {
                script {
                    sh 'export KUBECONFIG=/root/.kube/config' 
                    sh '/usr/local/bin/kubectl cluster-info'
                    // sh '/usr/local/bin/kubectl delete service user-service || true'
                    // sh '/usr/local/bin/kubectl delete deployment user-service || true'
                    sh "/usr/local/bin/kubectl delete -f ${KUBE_DEPLOYMENT} || true"
                    sh "/usr/local/bin/kubectl apply -f ${KUBE_DEPLOYMENT}"
                    sh 'kubectl port-forward svc/user-service 3001:3001 > /dev/null 2>&1 &'
                    echo "Deployment applied successfully"
                    // sh "/usr/local/bin/kubectl expose deployment user-service --type=NodePort --port=3001 || true"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully! Sending success notification...'
        }
        failure {
            script {
                echo 'Pipeline failed! Sending failure notification...'
            }
        }
        always {
            echo 'Pipeline execution completed (Success or Failure).'
        }
    }
}
