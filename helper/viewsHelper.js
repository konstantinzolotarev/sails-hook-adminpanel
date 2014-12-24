'use strict';

var path = require('path');

module.exports = {

    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    getViewPath: function getViewPath(view) {
        return path.join(sails.config.adminpanel.pathToViews, view);
    }
};
