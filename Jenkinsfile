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
                echo 'Running Python API tests...'
                sh 'docker compose run --rm python-api pytest'

                echo 'Checking directory structure...'
                sh 'ls -la'
                sh 'find . -name "pom.xml"'

                echo 'Running Spring Boot tests...'
                sh 'docker run --rm -v ${WORKSPACE}/manager_app:/app -w /app maven:3.9-eclipse-temurin-17 mvn test'
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