## New VW instance setup:

## Install Nginx:

```sudo apt update```

```sudo apt install nginx -y```

## Install Git:

```sudo apt-get install git-all```

## Install Node:

```sudo apt-get update```

```sudo apt-get install -y ca-certificates curl gnupg```

```sudo mkdir -p /etc/apt/keyrings```

```curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg```

```NODE_MAJOR=18```

```echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list```

```sudo apt-get update```

```sudo apt-get install nodejs -y```


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

```sudo unlink /etc/nginx/sites-available/default```

```rm /etc/nginx/sites-available/default```

```sudo cp nginx/proxy.conf /etc/nginx/conf.d```

Check configs:

```sudo nginx -t```

Reload Nginx:

```sudo nginx -s reload```

## Upload .env for server and frontend/.env

Upload server .env to project root.

Upload frontend/.env to project frontend/.

### Everhour API
/tokens/everhour-api.json
{
    "key": [API KEY],
    "url": "https://api-ro.everhour.com/reports/data"
}

### Firestore service account json credentials
/tokens/firestore.json
{
  projectId: FirestoreJSON.project_id,
  privateKey: FirestoreJSON.private_key,
  clientEmail: FirestoreJSON.client_email,
}

## Development Launch App
```npm run dev```


## Production with PM2
```sudo npm install pm2 -g```

```pm2 install typescript```

```npx tsc```

```pm2 start "npm run start:server" --name server```

```pm2 start "npm run start:front" --name front```

## Github Actions comments
Create Cloud Google JSON key for service account, add to github secrets.

Create SSH key for cloud project in Compute Engine -> Metadata, add private-ssh-key to github secrets.

Add permissions to google service account, ssh tunnel permission name: ```IAP-secured Tunnel User```

To enable git pull from service user (runner) ssh connection, run on VM:

```git config --global --add safe.directory [path/to/project]```

Add service user (runner) permission to access project folder:
- Ownership for mail user ```chown -R [user]:[user-group]```
- Add runner to main user group ```usermod -aG [user-group] runner```
- Read and write right for group ```chmod g+w -R .```

## Deploy manually to gcloud VM

install gcloud CLI and init

create folder on VM in /home/<user-name> folder

```mkdir -p server && mkdir -p frontend```

remember to create .env.prod files from .env.example for frontend and server

check if pm2 installed on VM

run ```sh manual-deploy.sh```

files will be in your user home folder on VM instance-2

login to VM and

run ```sh manual-run.sh```
