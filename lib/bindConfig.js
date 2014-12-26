'use strict';

var path = require('path');

module.exports = function(sails) {

    /**
     * Bind adminpanel config to views
     */
    if (!sails.config.adminpanel.pathToViews) {
        sails.config.adminpanel.pathToViews = path.join(__dirname, '../views/', sails.config.views.engine.name, '/');
    }
    // binding locals
    if (!sails.config.views.locals) {
        sails.config.views.locals = {};
    }
    //Creating params for admin panel views.
    if (!sails.config.views.locals.adminpanel) {
        sails.config.views.locals.adminpanel = {};
    }
    sails.config.views.locals.adminpanel.config = sails.config.adminpanel;
    sails.config.views.locals.adminpanel.fieldsHelper = require('../helper/fieldsHelper');

};
