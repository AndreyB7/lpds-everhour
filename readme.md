## Development Launch App

Server
```npm i```
```npm run dev```

Frontend

```npm i --prefix frontend```
```npm run dev --prefix frontend```

## New Google cloud VW instance setup:

### Install Nginx:

```sudo apt update```

```sudo apt install nginx -y```

### Install Node:

```sudo apt-get update```

```sudo apt-get install -y ca-certificates curl gnupg```

```sudo mkdir -p /etc/apt/keyrings```

```curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg```

```NODE_MAJOR=18```

```echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list```

```sudo apt-get update```

```sudo apt-get install nodejs -y```

### Configure Nginx:

Copy Nginx config:

```sudo unlink /etc/nginx/sites-available/default```

```rm /etc/nginx/sites-available/default```

Upload nginx/proxy.conf to VM [how to upload doc](https://cloud.google.com/compute/docs/instances/transfer-files)

```sudo cp proxy.conf /etc/nginx/conf.d```

Check configs:

```sudo nginx -t```

Reload Nginx:

```sudo nginx -s reload```

### Upload .env for server and frontend/.env

Upload server .env to project root.

Upload frontend/.env to project frontend/.

For GitHub pipeline upload to 'runner' user home directory (home/runner) with names .env.prod_server .env.prod_frontend

### Production run with PM2

```sudo npm install pm2 -g```

## GitHub Actions comments

Create Cloud Google JSON key for service account, add to github secrets.

Add permissions to google service account, ssh tunnel permission name: ```IAP-secured Tunnel User```

Add service user (runner) permission to access project folder:
- Ownership for main user ```chown -R [user]:[user-group] .```
- Add runner to main user group ```usermod -aG [user-group] runner```
- Read and write right for group ```chmod g+w -R .```

## Deploy manually to gcloud VM

Install gcloud CLI and init.

Create folder on VM in /home/<user-name> folder.

```mkdir -p server && mkdir -p frontend```

Remember to create .env.prod_server frontend/.env.prod_frontend files from .env.example for frontend and server.

run ```sh manual-deploy.sh```

Files will be in your user home folder on VM instance-2.

Login to VM and 

run ```sh manual-run.sh```
