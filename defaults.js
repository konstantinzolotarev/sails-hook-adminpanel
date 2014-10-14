'use strict';

/**
 * Implicit defaults
 *
 * @param  {Object} config
 * @context hook
 *
 * @return {Object}
 */
module.exports = function defaults(config) {
    return {

        /**
         * Title for admin panel
         */
        title: 'Admin Panel',

        /**
         * Default url prefix for admin panel
         */
        routePrefix: '/admin',

        /**
         * List of admin pages
         */
        instances: {}
    };
};