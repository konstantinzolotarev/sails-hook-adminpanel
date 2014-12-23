'use strict';

var _defaults = require('./defaults');
var _dashboard = require('./actions/dashboard');
var _ = require('lodash');
var path = require('path');

var _list = require('./actions/list');
var _edit = require('./actions/edit');
var _add = require('./actions/add');
var _view = require('./actions/view');
var _remove = require('./actions/remove');

module.exports = function (sails) {

    return {

        /**
         * List of hooks that required for adminpanel to work
         */
        requiredHooks: [
            'blueprints',
            'controllers',
            'orm',
            'policies',
            'views'
        ],

        /**
         * Creating default settings for hook
         */
        defaults: _defaults,


        initialize: function (cb) {
            //merging config
            var config = _.merge(this.defaults, sails.config.admin || {});

            // Set up listener to bind shadow routes when the time is right.
            //
            // Always wait until after router has bound static routes.
            // If policies hook is enabled, also wait until policies are bound.
            // If orm hook is enabled, also wait until models are known.
            // If controllers hook is enabled, also wait until controllers are known.
            var eventsToWaitFor = [];
            eventsToWaitFor.push('router:after');
            /**
             * Check hooks availability
             */
            _.forEach(this.requiredHooks, function(hook) {
                if (!sails.hooks[hook]) {
                    throw new Error('Cannot use `adminpanel` hook without the `' + hook +'` hook.');
                }
                eventsToWaitFor.push('hook:' + hook + ':loaded');
            });
            sails.after(eventsToWaitFor, function () {
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
                //@todo move route binding to separate file
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
            });
            cb();
        }
    };
};
