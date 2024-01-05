##!/usr/bin/env bash

tar -xzf frontend.tar -C frontend
tar -xzf server.tar -C server
npm ci --prefix server
pm2 delete all
cd server #for correct parse .end run PM2 from server folder
pm2 start server.js --name server
cd ..
pm2 start frontend/server.js --name frontend
rm frontend.tar server.tar