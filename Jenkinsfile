pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "manish1990786/user-service:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    def branchName = env.BRANCH_NAME ?: 'main'
                    echo "Building branch: ${branchName}"
                    try {
                        git branch: branchName, url: 'https://github.com/manish1990786/user-service'
                    } catch (Exception e) {
                        echo "Checkout failed: ${e.message}"
                        error("Stopping pipeline due to checkout failure.")
                    }
                }
            }
        }

        stage('Build') {
            steps {
                retry(2) {
                    script {
                        try {
                            bat 'npm install'
                        } catch (Exception e) {
                            echo "Build failed: ${e.message}"
                            error("Stopping pipeline due to build failure.")
                        }
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        // bat 'exit 1' // This forces the stage to fail
                        bat 'npm test --runInBand --forceExit'
                    } catch (Exception e) {
                        echo "Tests failed: ${e.message}"
                        error("Stopping pipeline due to test failure.")
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                retry(2) {
                    script {
                        try {
                            withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                            usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                                bat "docker build -t ${DOCKER_IMAGE} ."
                                bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                                bat "docker push ${DOCKER_IMAGE}"
                            }
                        } catch (Exception e) {
                            echo "Docker build/push failed: ${e.message}"
                            error("Stopping pipeline due to Docker failure.")
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    try {
                        echo "Pulling latest image from Docker Hub for Staging..."
                        bat "docker pull ${DOCKER_IMAGE}"
                        
                        echo "Stopping existing Staging container if running..."
                        bat "docker stop staging || exit 0"
                        bat "docker rm staging || exit 0"
                        
                        echo "Running Staging environment on port 3001..."
                        bat "docker run -d --name staging -p 3001:3000 ${DOCKER_IMAGE}"
                    } catch (Exception e) {
                        echo "Deployment to Staging failed: ${e.message}"
                        bat "docker stop staging || exit 0"
                        bat "docker rm staging || exit 0"
                        error("Stopping pipeline due to staging deployment failure.")
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    try {
                        echo "Pulling latest image from Docker Hub for Production..."
                        bat "docker pull ${DOCKER_IMAGE}"
                        
                        echo "Stopping existing Production container if running..."
                        bat "docker stop production || exit 0"
                        bat "docker rm production || exit 0"
                        
                        echo "Running Production environment on port 3002..."
                        bat "docker run -d --name production -p 3002:3000 ${DOCKER_IMAGE}"
                    } catch (Exception e) {
                        echo "Deployment to Production failed: ${e.message}"
                        bat "docker stop production || exit 0"
                        bat "docker rm production || exit 0"
                        error("Stopping pipeline due to production deployment failure.")
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully! Sending success notification...'
                
                emailext subject: "Jenkins Build SUCCESS: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                         body: "Build ${env.BUILD_NUMBER} completed successfully!\n\nCheck logs at: ${env.BUILD_URL}",
                         to: "manishbansal019@gmail.com",
                         from: "manishbansal019@gmail.com"
        }
        failure {
            script {
                echo 'Pipeline failed! Sending failure notification...'

                emailext subject: "Jenkins Build FAILED: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                         body: "Build ${env.BUILD_NUMBER} has failed!\nCheck logs at: ${env.BUILD_URL}",
                         to: "manishbansal019@gmail.com",
                         from: "manishbansal019@gmail.com"

                bat 'echo "Build failed on %DATE% %TIME%" >> build_logs.txt'
                bat 'docker logs staging >> build_logs.txt 2>&1'
                bat 'docker logs production >> build_logs.txt 2>&1'
            }
        }
        always {
            echo 'Pipeline execution completed (Success or Failure).'
        }
    }
}
