##!/usr/bin/env bash
rm -rf server
rm -rf frontentd
tar -xzf export.tar
npm ci --prefix server
cp .env.prod_frontend frontend/.env
cp .env.prod_server server/server/.env
pm2 delete all
cd server/server
pm2 start server.js --name server
cd ..
pm2 start frontend/server.js --name frontend
rm export.tar run.sh