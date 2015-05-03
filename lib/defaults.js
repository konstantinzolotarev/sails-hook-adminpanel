'use strict';

module.exports = {
    /**
     * Default admin config
     */
    adminpanel: {
        /**
         * Title for admin panel
         */
        title: 'Admin Panel',

        /**
         * Default url prefix for admin panel
         */
        routePrefix: '/admin',

        /**
         * Will set method how assets will be placed into project
         */
        assets: 'copy',

        /**
         * Default path to views
         *
         * @type {?string}
         */
        pathToViews: null,

        /**
         * Name of model identifier field
         */
        identifierField: 'id',

        /**
         * Default policy that will be used to check access
         */
        policy: '',

        /**
         * List of admin pages
         */
        instances: {}
    }
};
