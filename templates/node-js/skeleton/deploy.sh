#!/bin/bash

echo "";
echo "Install all dependencies";
if ! npm install; then echo "NPM error occurred - Deploy failed"; exit 1; fi

echo "";
echo "Installing 'Forever' globally - To keep the mediator up and running";
sudo npm install forever -g

echo "";
echo "Starting up the mediator server - Using forever";
forever start app.js

IP=`ifconfig eth0 | grep "inet " | awk '{gsub("addr:","",$2);  print $2 }'`

echo "";
echo "The mediator can be reached at this endpoint: http://$IP:2867/";
echo "Unless it has been changed in app.js";
echo "";
echo "Use 'forever stop app.js' to kill the mediator server";
echo "";