#!/bin/bash
echo "SAILS-HOOK-ADMINPANEL BUILD by 42team"
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cd assets

rm -rf vendor
mkdir vendor
cp -r bower_components/ckeditor vendor
cp -r bower_components/jquery vendor
cp -r bower_components/webcomponentsjs vendor 
cp -r bower_components/jsoneditor vendor
cp -r bower_components/ace vendor

cd polymer
rm elements-vulcanized.html
vulcanize --inline-scripts --inline-css --strip-comments elements.html > elements-vulcanized.html

# delete sails assets
cd $SCRIPTPATH
rm -rf ../../assets/admin
rm -rf ../../.tmp/public/admin


cp -r ./assets ../../assets/admin  

mkdir -p ../../.tmp/public/admin
cp -r ./assets ../../.tmp/public/admin
