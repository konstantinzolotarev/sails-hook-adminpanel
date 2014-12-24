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
         * Will link current assets to project
         */
        linkAssets: true,

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
         * List of admin pages
         */
        instances: {}
    }
};
