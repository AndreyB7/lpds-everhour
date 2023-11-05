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

## Upload 'tokens'

Upload tokens folder to project root:

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
```pm2 start build/server.ts```