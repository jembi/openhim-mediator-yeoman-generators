Ensure you have your Node enviroment setup:
sudo apt-get update
sudo apt-get install build-essential libssl-dev
sudo apt-get install npm

Install Node throught the Node Version Manager (nvm)
curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh
nvm install 0.11.13

To deploy the mediator and install all dependencies you can execute:
./deploy.sh

NB! this will execute 'Forever' to keep the mediator running.
To stop the 'Forever' script, execute:
forever stop app.js

Alternatively, you can start the mediator with node:
node app.js

NB! ensure all dependencies are installed with:
npm install
