##!/usr/bin/env bash

npm run build &&
cd frontend && npm run build &&
cd ..
tar --exclude='.env' --disable-copyfile --no-xattrs -czf server.tar -C build .
tar --exclude='.env' --disable-copyfile --no-xattrs -czf frontend.tar -C frontend/.next/standalone .
gcloud compute scp server.tar instance-2:
gcloud compute scp frontend.tar instance-2: &&
rm server.tar
rm frontend.tar
gcloud compute scp .env.prod_server instance-2:server/.env
gcloud compute scp frontend/.env.prod_frontend instance-2:frontend/.env
gcloud compute scp manual-run.sh instance-2:
# open VM ssh console
gcloud compute ssh instance-2
