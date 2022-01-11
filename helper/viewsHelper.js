'use strict';

var path = require('path');
var _ = require('lodash');

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
    getPathToEngine: function (engine) {
        return path.join(this.BASE_VIEWS_PATH, engine, '/')
    },

    /**
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {string}
     */
    getViewPath: function getViewPath(view) {
        return path.resolve(sails.config.adminpanel.pathToViews, view);
    },

    /**
     *
     * @param {IncommingMessage} req
     * @param {string} type Types: adminError|adminSuccess
     */
    hasFlash: function (req, type) {
        return (req.session.flash && req.session.flash[type]);
    },

    /**
     * Get needed field value from dat provided.
     *
     * @param {string} key
     * @param {object} field
     * @param {Array} data
     */
    getFieldValue: function (key, field, data) {
        var value = data[key];
        if (_.isObject(value) && field.config.type == 'association') {
            value = value[field.config.identifierField];
        }
        if (_.isArray(value) && field.config.type == 'association-many') {
            var result = [];
            value.forEach(function (val) {
                result.push(val[field.config.identifierField]);
            });
            return result;
        }
        return value;
    },

    /**
     * Check if given option equals value or is in array
     *
     * @param {string|number} option
     * @param {string|number|Array} value
     * @returns {boolean}
     */
    isOptionSelected: function (option, value) {
        if (_.isArray(value)) {
            return _.includes(value, option);
        } else {
            return (option == value);
        }
    },

    /**
     * Get's field value for view screen
     *
     * @param {string|number|boolean|object|Array} value
     * @param {object} field
     */
    getAssociationValue: function (value, field) {
        if (!value) {
            return '-----------';
        }
        var displayField = field.config.displayField || 'id';
        if (_.isArray(value)) {
            var result = '';
            value.forEach(function (val) {
                result += val[displayField] + '<br/>';
            });
            return result;
        }
        if (_.isObject(value)) {
            return value[displayField];
        }
        return value;
    }
};
