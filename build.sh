#!/bin/bash

cd assets

rm -rf vendor
mkdir vendor
cp -r bower_components/ckeditor vendor
cp -r bower_components/jquery vendor
cp -r bower_components/webcomponentsjs vendor

cd polymer
rm elements-vulcanized.html
vulcanize --inline-scripts --inline-css --strip-comments elements.html > elements-vulcanized.html
