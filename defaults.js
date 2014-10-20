'use strict';

module.exports = {
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
};