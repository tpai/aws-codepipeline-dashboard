#!bin/bash

AWS_REGION=$(cat ~/.aws/config | grep region | awk -F "=" '{print $NF}' | sed -e 's/^ *//')
AWS_ACCESS_KEY_ID=$(cat ~/.aws/credentials | grep access_key_id | awk -F "=" '{print $NF}' | sed -e 's/^ *//')
AWS_SECRET_ACCESS_KEY=$(cat ~/.aws/credentials | grep secret_access_key | awk -F "=" '{print $NF}' | sed -e 's/^ *//')

echo "VUE_APP_AWS_REGION=$AWS_REGION
VUE_APP_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
VUE_APP_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" > .env.local
