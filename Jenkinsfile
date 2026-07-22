pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_NAME = 'agency-platform'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify tools') {
            steps {
                sh '''
                    node --version
                    npm --version
                    docker --version
                '''
            }
        }

        stage('Backend build') {
            steps {
                dir('backend') {
                    sh 'npm ci && npm run build'
                }
            }
        }

        stage('Frontend build') {
            steps {
                dir('frontend') {
                    sh 'npm ci && npm run build'
                }
            }
        }

        stage('Build Docker images') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')
                ]) {
                    sh '''
                        docker build --build-arg FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000} -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-backend:${BUILD_NUMBER} -f backend/Dockerfile backend
                        docker build --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3001/api} --build-arg NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://localhost:3001} --build-arg NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-http://localhost:3000} -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-frontend:${BUILD_NUMBER} -f frontend/Dockerfile frontend
                        docker tag ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-backend:${BUILD_NUMBER} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-backend:latest
                        docker tag ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-frontend:${BUILD_NUMBER} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-frontend:latest
                    '''
                }
            }
        }

        stage('Local Deploy') {
            steps {
                sh '''
                    set -e
                    # Use production compose to deploy locally on the Jenkins agent
                    docker compose -f docker-compose.prod.yml --env-file .env up -d --build
                    # simple healthcheck against nginx
                    sleep 5
                    if ! curl -kI -m 10 https://127.0.0.1 | grep -q "HTTP/1.[01] 200\|HTTP/2 200"; then
                      echo "Healthcheck failed"; exit 1
                    fi
                '''
            }
        }

        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')
                ]) {
                    sh '''
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-backend:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-frontend:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-backend:latest
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy to VPS') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD'),
                    string(credentialsId: 'postgres-password', variable: 'POSTGRES_PASSWORD'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'jwt-refresh-secret', variable: 'JWT_REFRESH_SECRET'),
                    string(credentialsId: 'vps-host', variable: 'VPS_HOST'),
                    string(credentialsId: 'vps-user', variable: 'VPS_USER'),
                    string(credentialsId: 'vps-deploy-path', variable: 'VPS_DEPLOY_PATH'),
                    sshUserPrivateKey(credentialsId: 'vps-ssh-credentials', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')
                ]) {
                    sh '''
                        set -e
                        mkdir -p .tmp-deploy
                        cp deploy-vps.sh .tmp-deploy/deploy-vps.sh
                        chmod +x .tmp-deploy/deploy-vps.sh

                        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null .tmp-deploy/deploy-vps.sh "$SSH_USER@$VPS_HOST:$VPS_DEPLOY_PATH/deploy-vps.sh"
                        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null docker-compose.prod.yml "$SSH_USER@$VPS_HOST:$VPS_DEPLOY_PATH/docker-compose.prod.yml"
                        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r nginx "$SSH_USER@$VPS_HOST:$VPS_DEPLOY_PATH/nginx"

                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SSH_USER@$VPS_HOST" "chmod +x $VPS_DEPLOY_PATH/deploy-vps.sh && cd $VPS_DEPLOY_PATH && export DOCKERHUB_USERNAME=$DOCKERHUB_USERNAME POSTGRES_PASSWORD=$POSTGRES_PASSWORD JWT_SECRET=$JWT_SECRET JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET FRONTEND_URL=${FRONTEND_URL:-http://your-domain.com} NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://your-domain.com/api} NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://your-domain.com} NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-http://your-domain.com} && ./deploy-vps.sh"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}