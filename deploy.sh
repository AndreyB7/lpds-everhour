cd /home/g0129507/lpds-everhour;
sudo git pull &&
sudo npm ci &&
cd frontend &&
sudo npm ci &&
cd .. &&
sudo pm2 delete all &&
sudo pm2 start "npm run start:server" --name server &&
sudo pm2 start "npm run start:front" --name front
