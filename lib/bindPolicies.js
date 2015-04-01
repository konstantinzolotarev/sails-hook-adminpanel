'use strict';

var _ = require('lodash');

module.exports = function (sails) {

    return function (policies, action) {
        if (_.isFunction(policies) && !action) {
            action = policies;
            policies = '';
        }
        if (!policies) {
            return action;
        }
        var result = [];

        /**
         * Bind policy to action
         *
         * @param {string|function} policy
         */
        var bindPolicy = function (policy) {
            if (_.isFunction(policy)) {
                result.push(policy);
                return;
            }
            //Check for policy existance
            if (!sails.hooks.policies.middleware[policy.toLowerCase()]) {
                sails.log.error('AdminPanel: No policy exist: ' + policy);
            } else {
                result.push(sails.hooks.policies.middleware[policy.toLowerCase()]);
            }
        };
        if (_.isArray(policies)) {
            _.forEach(policies, bindPolicy);
        } else {
            bindPolicy(policies);
        }
        if (result.length === 0) {
            return action;
        }
        result.push(action);
        return result;
    };
};
