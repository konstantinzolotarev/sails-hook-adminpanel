'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

module.exports = function ToConfigure(sails) {

    return function configure() {
        //recheck reoute prefix
        sails.config.adminpanel.routePrefix = sails.config.adminpanel.routePrefix || '/admin';
        //check and adding base slash
        if (sails.config.adminpanel.routePrefix.indexOf('/') != 0) {
            sails.config.adminpanel.routePrefix = '/' + sails.config.adminpanel.routePrefix;
        }

        if (sails.config.adminpanel.linkAssets === true) {
            var assetsDir = path.join(__dirname, '../assets');
            var destAssets = path.join(sails.config.appPath, 'assets/admin');
            if (!fs.existsSync(destAssets)) {
                fs.symlinkSync(assetsDir, destAssets, 'dir');
            }
        }
    };
};
