#!/usr/bin/env bash
trap "set +x; sleep 5; set -x" DEBUG

cd /home/g0129507/lpds-everhour &&
git pull &&
npm i &&
npm run build &&
pm2 delete server || true &&
pm2 start build/server.js --name server &&
cd frontend &&
npm i &&
npm run build &&
pm2 delete front || true &&
pm2 start npm --name front -- run start
 