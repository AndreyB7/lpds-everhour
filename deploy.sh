cd /home/g0129507/lpds-everhour;
sudo su &&
git pull &&
sudo npm i &&
pm2 delete all &&
pm2 start build/server --name server &&
cd frontend &&
sudo npm i &&
sudo npm run build &&
pm2 start "npm run start" --name front
