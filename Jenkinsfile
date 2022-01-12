pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "sudo npm install"
                sh "sudo npm run build"
                sh "sudo npm run export"
            }
        }
        stage("Deploy") {
            steps {
            echo "deploying"
            }
        }
    }
}
