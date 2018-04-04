'use strict';

var _ = require('lodash');
var async = require('async');
var path = require('path');
var fs = require('fs');
var ncp = require('ncp').ncp;

module.exports = function(sails, cb) {
    cb = cb || function() {};

    // Check and set default value
    if (!sails.config.adminpanel.assets) {
        sails.config.adminpanel.assets = 'copy';
    }

    if (sails.config.adminpanel.assets === 'link') {
        var assetsDir = path.join(__dirname, '../assets');
        var destAssets = path.join(sails.config.appPath, 'assets/admin');
        if (!fs.existsSync(destAssets)) {
            fs.symlink(assetsDir, destAssets, 'dir', cb);
        } else {
            return cb();
        }
    } else if (sails.config.adminpanel.assets === 'copy') {
        var assetsDir = path.join(__dirname, '../assets');
        var destAssets = path.join(sails.config.appPath, 'assets/admin');
        if (!fs.existsSync(destAssets)) {
            ncp(assetsDir, destAssets, cb);
        } else {
            return cb();
        }
    } else {
        cb(new Error('Assets not configured !'));
    }
};
