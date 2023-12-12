cd /home/g0129507/lpds-everhour
sudo git pull
sudo npm ci
sudo rm -rf /build
sudo npm run build
sudo pm2 restart all;
