'use strict';

var path = require('path');

var _dashboard = require('../actions/dashboard');
var _list = require('../actions/list');
var _edit = require('../actions/edit');
var _add = require('../actions/add');
var _view = require('../actions/view');
var _remove = require('../actions/remove');

module.exports = function ToBindRoutes(sails, config) {

    return function bindRoutes() {
        //binding config to views
        //@todo really needed here ?
        if (!sails.config.views.locals) {
            sails.config.views.locals = {};
        }
        sails.config.views.locals.adminConfig = config.admin;

        //recheck reoute prefix
        config.routePrefix = config.routePrefix || '/admin';
        //check and adding base slash
        if (config.routePrefix.indexOf('/') != 0) {
            config.routePrefix = '/' + config.routePrefix;
        }

        //Create a base instance route
        var baseRoute = path.join(config.routePrefix, ':instance');
        /**
         * List of records
         */
        sails.router.bind(baseRoute, _list);
        /**
         * Create new record
         */
        sails.router.bind(path.join(baseRoute, 'add'), _add);
        /**
         * View record details
         */
        sails.router.bind(path.join(baseRoute, 'view/:id'), _view);
        /**
         * Edit existing record
         */
        sails.router.bind(path.join(baseRoute, 'edit/:id'), _edit);
        /**
         * Remove record
         */
        sails.router.bind(path.join(baseRoute, 'remove/:id'), _remove);
        /**
         * Create a default dashboard
         * @todo define information that should be shown here
         */
        sails.router.bind(config.routePrefix, _dashboard);
    };
};
