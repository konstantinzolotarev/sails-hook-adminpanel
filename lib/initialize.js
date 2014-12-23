'use strict';

var _ = require('lodash');

var bindRoutes = require('./bindRoutes');

module.exports = function ToInitialize(sails) {

    /**
     * List of hooks that required for adminpanel to work
     */
    var requiredHooks = [
        'blueprints',
        'controllers',
        'orm',
        'policies',
        'views'
    ];

    return function initialize(cb) {
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
        _.forEach(requiredHooks, function(hook) {
            if (!sails.hooks[hook]) {
                throw new Error('Cannot use `adminpanel` hook without the `' + hook +'` hook.');
            }
            //if (hook == 'policies') {
            //    eventsToWaitFor.push('hook:' + hook + ':bound');
            //} else {
                eventsToWaitFor.push('hook:' + hook + ':loaded');
            //}
        });

        sails.after(eventsToWaitFor, function() {
            cb();
            bindRoutes(sails, config)();
        });
    }
};
