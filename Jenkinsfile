pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
            }
        }

        stage('Build Containers') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose build'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running Python tests...'
                sh 'docker compose run --rm python-api pytest'

                echo 'Running Spring Boot tests...'
                sh 'docker run --rm -v ${WORKSPACE}/spring-backend:/app -w /app maven:3.9-eclipse-temurin-17 mvn test'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up containers...'
            sh 'docker compose down --volumes'
        }
        success {
            echo 'Pipeline passed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}