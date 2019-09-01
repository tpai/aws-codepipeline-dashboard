#!bin/bash

getValue() {
  if [ ! -z $3 ]; then
    echo $3
    return 1
  fi

  VALUE=$(echo $1 | awk -F "=" '{print $NF}' | sed -e 's/^ *//')
  echo $VALUE
}

AWS_REGION=$(getValue $(cat ~/.aws/config | grep region))
AWS_ACCESS_KEY_ID=$(getValue $(cat ~/.aws/credentials | grep access_key_id))
AWS_SECRET_ACCESS_KEY=$(getValue $(cat ~/.aws/credentials | grep secret_access_key))

cat <<EOF > .env.local
VUE_APP_AWS_REGION=$AWS_REGION
VUE_APP_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
VUE_APP_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
EOF
