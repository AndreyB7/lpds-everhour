cd /home/g0129507/lpds-everhour;
sudo git pull;
sudo npm ci;
sudo rm -rf /build;
sudo pm2 stop all;
sudo pm2 delete all;
sudo npm run build;
sudo pm2 start "npm run start:server" --name server;
sudo pm2 start "npm run start:front" --name front;
