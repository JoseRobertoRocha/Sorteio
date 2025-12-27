pipeline {
    agent any

    stages {

        stage('Build JAR') {
            steps {
                echo '🔨 Compilando aplicação'
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
