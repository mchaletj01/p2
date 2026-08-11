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
                echo 'Running tests across services...'
                sh 'docker compose run --rm python-api pytest'

                sh 'docker compose run --rm spring-backend mvn test'
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