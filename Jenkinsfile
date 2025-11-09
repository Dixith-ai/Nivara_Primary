pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nivara-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'nivara-app'
    }

    stages {
        stage('Pull Code') {
            steps {
                script {
                    echo '📥 Pulling latest code from GitHub...'
                    checkout scm
                    sh 'git branch -a'
                    sh 'git log -1 --oneline'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo '🔨 Building Docker image...'
                    def buildArgs = ''
                    if (env.VITE_SUPABASE_URL) {
                        buildArgs += " --build-arg VITE_SUPABASE_URL=${env.VITE_SUPABASE_URL}"
                    }
                    if (env.VITE_SUPABASE_ANON_KEY) {
                        buildArgs += " --build-arg VITE_SUPABASE_ANON_KEY=${env.VITE_SUPABASE_ANON_KEY}"
                    }
                    sh "docker build${buildArgs} -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo '🛑 Stopping old container (if exists)...'
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    echo '🚀 Starting new container...'
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p 80:80 \
                        ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo '🏥 Performing health check...'
                    sleep(time: 5, unit: 'SECONDS')
                    sh """
                        curl -f http://localhost/health || exit 1
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
            script {
                sh """
                    echo 'Container Status:'
                    docker ps | grep ${CONTAINER_NAME} || true
                    echo ''
                    echo 'Container Logs (last 20 lines):'
                    docker logs --tail 20 ${CONTAINER_NAME} || true
                """
            }
        }
        failure {
            echo '❌ Build or deployment failed!'
            script {
                sh """
                    echo 'Container Logs (last 50 lines):'
                    docker logs --tail 50 ${CONTAINER_NAME} || true
                """
            }
        }
        always {
            echo '🧹 Cleaning up...'
            script {
                // Keep only the last 5 images to save disk space
                sh """
                    docker images ${DOCKER_IMAGE} --format '{{.ID}}' | tail -n +6 | xargs -r docker rmi || true
                """
            }
        }
    }
}

