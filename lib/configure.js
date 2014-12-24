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
            //@todo might be throw an error here ?
        }

        if (!_.isObject(sails.config.views.engine) || sails.config.views.engine.name !== 'jade') {
            throw new Error('For now adminpanel hook could work only with Jade template engine.');
        }

        if (!sails.config.adminpanel.pathToViews) {
            sails.config.adminpanel.pathToViews = path.join(__dirname, '../views/', sails.config.views.engine.name, '/');
        }

        //binding config to views
        if (!sails.config.views.locals) {
            sails.config.views.locals = {};
        }
        sails.config.views.locals.adminPanelConfig = sails.config.adminpanel;

        if (sails.config.adminpanel.linkAssets === true) {
            var assetsDir = path.join(__dirname, '../assets');
            var destAssets = path.join(sails.config.appPath, 'assets/admin');
            if (!fs.existsSync(destAssets)) {
                fs.symlinkSync(assetsDir, destAssets, 'dir');
            }
        }
    };
};
