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
                echo 'Running Python API unit tests...'
                sh 'docker compose run --rm python-api pytest'

                echo 'Running Spring Boot unit tests only...'
                sh '''
                  docker run --rm \
                    --volumes-from jenkins-local \
                    -w ${WORKSPACE}/manager_app \
                    maven:3.9-eclipse-temurin-17 \
                    mvn test -Dtest="com.expense.manager.controller.**.*Test,com.expense.manager.dao.**.*Test"
                '''
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