pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        dockerTool 'Docker'
    }

    environment {
        DOCKER_IMAGE = "manish1990786/user-service:latest"
        KUBE_DEPLOYMENT = "deployment.yaml"
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

        // stage('Build') {
        //     steps {
        //         retry(2) {
        //             script {
        //                 sh 'npm install'
        //             }
        //         }
        //     }
        // }

        // stage('Test') {
        //     steps {
        //         script {
        //             sh 'npm test --runInBand --forceExit'
        //         }
        //     }
        // }

        stage('Retrieve .env from Jenkins') {
            steps {
                withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE .env'
                }
            }
        }

        // stage('Docker Build & Push') {
        //     when { expression { env.BRANCH_NAME == 'main' } }
        //     steps {
        //         retry(2) {
        //             script {
        //                 withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials',
        //                 usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //                     sh "docker build -t ${DOCKER_IMAGE} ."
        //                     sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
        //                     sh "docker push ${DOCKER_IMAGE}"
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Deploy to Minikube') {
            when { expression { env.BRANCH_NAME == 'test' } }
            steps {
                script {
                    sh 'export KUBECONFIG=/root/.kube/config' 
                    // sh '/usr/local/bin/minikube status'
                    sh '/usr/local/bin/kubectl cluster-info'
                    // sh 'eval $(/usr/local/bin/minikube docker-env) && echo "Docker environment set"'
                    sh "/usr/local/bin/kubectl apply -f ${KUBE_DEPLOYMENT}"
                    echo "Deployment applied successfully"
                    sh "/usr/local/bin/kubectl expose deployment user-service --type=NodePort --port=3001"
                    // sh "/usr/local/bin/minikube service user-service --url"
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
