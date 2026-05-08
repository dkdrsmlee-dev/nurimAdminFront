pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
  }

  environment {
    FRONT_IMAGE = 'nurim-admin-front'
    FRONT_CONTAINER = 'nurim-admin-front'
    FRONT_HOST_PORT = '3001'
    FRONT_CONTAINER_PORT = '80'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Docker Check') {
      steps {
        sh 'docker version'
        sh 'docker ps'
      }
    }

    stage('Build Front Image') {
      steps {
        sh 'docker build --pull -t "$FRONT_IMAGE:latest" -f Dockerfile .'
      }
    }

    stage('Deploy Front Container') {
      steps {
        sh '''
          docker rm -f "$FRONT_CONTAINER" 2>/dev/null || true
          docker run -d \
            --name "$FRONT_CONTAINER" \
            --restart unless-stopped \
            -p "$FRONT_HOST_PORT:$FRONT_CONTAINER_PORT" \
            "$FRONT_IMAGE:latest"
        '''
      }
    }

    stage('Verify Front Container') {
      steps {
        sh 'docker inspect -f "{{.State.Running}}" "$FRONT_CONTAINER" | grep -x true'
        sh 'docker port "$FRONT_CONTAINER" "$FRONT_CONTAINER_PORT"'
        sh 'docker exec "$FRONT_CONTAINER" wget -qO- "http://127.0.0.1/login" >/dev/null'
      }
    }
  }

  post {
    failure {
      sh 'docker logs --tail=120 "$FRONT_CONTAINER" || true'
    }
  }
}
