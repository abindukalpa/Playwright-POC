pipeline {
    agent {
        docker {
            image 'playwright-poc'
        }
    }
    stages {
        stage('nxt') {
            options {
                retry(3)
            }
            environment {
                // TODO: draw these in at the pipeline stage?
                URL = 'https://skyvegas.com.nxt.ppbdev.com/'
                USERNAME = 'BLANK'
                PASSWORD= 'BLANK'
            }
            steps {
                script {
                    echo 'running tests in nxt'
                }
            }
            post {
                success {
                    echo 'tests passed in nxt'
                }
                failure {
                    error('retry limit exceeded, stopping tests')
                }
            }
        }
        // TODO
        stage('live') {
        }
    }
}
