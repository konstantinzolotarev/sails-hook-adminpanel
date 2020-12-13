'use strict';

var viewsHelper = require('../helper/viewsHelper');

module.exports = function(sails) {

    /**
     * Bind adminpanel config to views
     */
    if (!sails.config.adminpanel.pathToViews) {
        sails.config.adminpanel.pathToViews = viewsHelper.getPathToEngine(sails.config.views.extension);
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
    sails.config.views.locals.adminpanel.viewHelper = viewsHelper;
    sails.config.views.locals.adminpanel.fieldsHelper = require('../helper/fieldsHelper');
    sails.config.views.locals.adminpanel.menuHelper = require('../helper/menuHelper')(sails.config.adminpanel);
    sails.config.views.locals.adminpanel.configHelper = require('../helper/configHelper')(sails);
};
