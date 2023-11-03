## New VW instance:

## Install Nginx:

```sudo apt update```

```sudo apt install nginx -y```

## Install Git:

```sudo apt-get install git-all```

## Install Node:

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=18

echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs -y


## Install APP:

Logout from root:

```exit```

```cd /home/[user]```

```mkdir lpds-everhour```

```cd lpds-everhour```

```git init```

```git remote add origin [repo-url]```

Pull project:

```git pull origin main```

Install dependencies:

```npm install```

Copy Nginx config:

```cp nginx/proxy.conf /etc/nginx/conf.d```

## Upload 'tokens'

Upload tokens folder to project root:

/tokens/everhour-api.json
{
    "key": [API KEY],
    "url": "https://api-ro.everhour.com/reports/data"
}

/tokens/firestore.json
{
  "type": "service_account",
  "project_id": "lpds-everhour",
  "private_key_id": "***",
  "private_key": "***",
  "client_email": "lpds-db@lpds-everhour.iam.gserviceaccount.com",
  "client_id": "***",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/lpds-db%40lpds-everhour.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}