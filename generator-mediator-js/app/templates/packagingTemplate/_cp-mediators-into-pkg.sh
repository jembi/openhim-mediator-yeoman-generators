#!/bin/bash
set -e

mkdir -p targets/trusty/usr/share
rm -rf targets/trusty/usr/share/*

echo "Cloning base mediators..."
git clone https://github.com/jembi/<%= appName %>.git targets/trusty/usr/share/<%= appName %>
echo "Done."

echo "Downloading module dependencies..."
(cd targets/trusty/usr/share/<%= appName %>/ && npm install)
echo "Done."