'use strict';

module.exports = {
    /**
     * Default admin config
     */
    adminpanel: {

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
         * Base menu configuration
         */
        menu: {
            // Should admin panel brand be visible ?
            brand: true,
            // Menu groups
            groups: []
        },

        /**
         * List of admin pages
         */
        instances: {}
    }
};
