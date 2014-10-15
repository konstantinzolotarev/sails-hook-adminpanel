'use strict';

var _defaults = require('./defaults');
var _dashboard = require('./dashboard');
var _ = require('lodash');
var path = require('path');

var _list = require('./actions/list');
var _edit = require('./actions/edit');
var _add = require('./actions/add');

module.exports = function(sails) {
    return {

        defaults: {

            /**
             * Default admin config
             */
            admin: {
                /**
                 * Title for admin panel
                 */
                title: 'Admin Panel',

                /**
                 * Default url prefix for admin panel
                 */
                routePrefix: '/admin',

                /**
                 * Default path to views
                 */
                pathToViews: '../api/hooks/admin/views/',

                /**
                 * Name of model identifier field
                 */
                identifierField: 'id',

                /**
                 * List of admin pages
                 */
                instances: {}
            }
        },

        initialize: function(cb) {

            var self = this;

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
            sails.after(eventsToWaitFor, function() {
                sails.config.views.locals.adminConfig = config.admin;
                _.forIn(config.instances, function(route, key) {
                    console.log(route);
                    console.log(key);
                    sails.log.verbose('Creating admin pages for: '+key);
                    var baseRoute = path.join(config.routePrefix, key);
                    console.log(path.join(baseRoute, 'add'));
                    sails.router.bind(baseRoute, _list);
                    sails.router.bind(path.join(baseRoute, 'add'), _add);
                    sails.router.bind(path.join(baseRoute, 'edit/:id'), _edit);
                    sails.router.bind(path.join(baseRoute, 'remove/:id'), _list);
                });
                sails.router.bind(config.routePrefix || '/admin', _dashboard);
            });
            cb();
        }
    };
};