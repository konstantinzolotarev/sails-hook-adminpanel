'use strict';

var _defaults = require('./defaults');
var _dashboard = require('./actions/dashboard');
var _ = require('lodash');
var path = require('path');

var _list = require('./actions/list');
var _edit = require('./actions/edit');
var _add = require('./actions/add');
var _view = require('./actions/view');

module.exports = function (sails) {

    return {

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
            if (sails.hooks.policies) {
                eventsToWaitFor.push('hook:policies:bound');
            }
            if (sails.hooks.orm) {
                eventsToWaitFor.push('hook:orm:loaded');
            }
            if (sails.hooks.controllers) {
                eventsToWaitFor.push('hook:controllers:loaded');
            }
            if (sails.hooks.blueprints) {
                eventsToWaitFor.push('hook:blueprints:loaded');
            }
            sails.after(eventsToWaitFor, function () {
                //binding config to views
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
                sails.router.bind(path.join(baseRoute, 'remove/:id'), _list);
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