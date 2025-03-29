pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        docker 'Docker'
    }

    environment {
        DOCKER_IMAGE = "manish1990786/user-service:latest"
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

        stage('Docker Build & Push') {
            when { expression { env.BRANCH_NAME == 'main' } }
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

        stage('Deploy to Staging') {
            when { expression { env.BRANCH_NAME == 'main' } }
            steps {
                script {
                    echo "Pulling latest image from Docker Hub for Staging..."
                    sh "docker pull ${DOCKER_IMAGE}"

                    echo "Stopping existing Staging container if running..."
                    sh "docker stop staging || true"
                    sh "docker rm staging || true"

                    echo "Running Staging environment on port 3001..."
                    sh "docker run -d --name staging -p 3001:3000 ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to Production') {
            when { expression { env.BRANCH_NAME == 'main' } }
            steps {
                script {
                    echo "Pulling latest image from Docker Hub for Production..."
                    sh "docker pull ${DOCKER_IMAGE}"

                    echo "Stopping existing Production container if running..."
                    sh "docker stop production || true"
                    sh "docker rm production || true"

                    echo "Running Production environment on port 3002..."
                    sh "docker run -d --name production -p 3002:3000 ${DOCKER_IMAGE}"
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
