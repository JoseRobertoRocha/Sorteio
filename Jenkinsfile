pipeline {
    agent any

    environment {
        SPRING_DATASOURCE_URL = credentials('SPRING_DATASOURCE_URL')
        SPRING_DATASOURCE_USERNAME = credentials('SPRING_DATASOURCE_USERNAME')
        SPRING_DATASOURCE_PASSWORD = credentials('SPRING_DATASOURCE_PASSWORD')
    }

    stages {
        stage('Build JAR') {
            steps {
                echo '🔨 Compilando aplicação'
                sh 'chmod +x mvnw'
                sh './mvnw clean package -DskipTests'
            }
        }

        stage('Docker Compose Down') {
            steps {
                echo '🧹 Parando containers antigos'
                sh 'docker compose down || true'
            }
        }

        stage('Docker Compose Up') {
            steps {
                echo '🐳 Buildando e subindo containers'
                sh 'docker compose up -d --build'
            }
        }

        stage('Status') {
            steps {
                sh 'docker compose ps'
            }
        }
    }
}
