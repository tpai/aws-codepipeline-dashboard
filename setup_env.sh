#!bin/bash

AWS_REGION=$(awk -F "[ =]+" '/^region/{print $2; exit}' ~/.aws/config)
AWS_ACCESS_KEY_ID=$(awk -F "[ =]+" '/^aws_access_key_id/{print $2; exit}' ~/.aws/credentials)
AWS_SECRET_ACCESS_KEY=$(awk -F "[ =]+" '/^aws_secret_access_key/{print $2; exit}' ~/.aws/credentials)

cat <<EOF > .env.local
VUE_APP_AWS_REGION=$AWS_REGION
VUE_APP_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
VUE_APP_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
EOF
