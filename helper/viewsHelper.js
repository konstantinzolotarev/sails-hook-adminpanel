'use strict';

var path = require('path');

module.exports = {

    /**
     * Base path for all views.
     */
    BASE_VIEWS_PATH: path.join(__dirname, '../views/'),


    /**
     * Generate path to views files for given view engine
     *
     * @param {string} engine - View engine name. E.g. 'jade', 'ejs'...
     * @returns {string}
     */
    getPathToEngine: function(engine) {
        return path.join(this.BASE_VIEWS_PATH, engine, '/')
    },

    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    getViewPath: function getViewPath(view) {
        return path.join(sails.config.adminpanel.pathToViews, view);
    },

    /**
     *
     * @param {IncommingMessage} req
     * @param {string} type Types: adminError|adminSuccess
     */
    hasFlash: function(req, type) {
        return (req.session.flash && req.session.flash[type]);
    }
};
