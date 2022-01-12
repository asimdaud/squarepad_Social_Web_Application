pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "npm install"
                sh "npm run build"
                sh "npm run export"
            }
        }
        stage("Deploy") {
            steps {
            echo "deploying"
            }
        }
    }
}
