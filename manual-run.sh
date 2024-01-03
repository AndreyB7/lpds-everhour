##!/usr/bin/env bash

tar -xf frontend.tar -C frontend
tar -xf server.tar -C server
cd server
npm ci &&
cd ..
pm2 delete all
cd server
pm2 start server.js --name server
cd ..
pm2 start frontend/server.js --name frontend
rm frontend.tar server.tar