#!/bin/bash
echo "SAILS-HOOK-ADMINPANEL"
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# delete sails assets
cd $SCRIPTPATH
rm -rf ../../assets/admin
rm -rf ../../.tmp/public/admin

cp -r ./assets ../../assets/admin  

mkdir -p ../../.tmp/public/admin
cp -r ./assets ../../.tmp/public/admin
