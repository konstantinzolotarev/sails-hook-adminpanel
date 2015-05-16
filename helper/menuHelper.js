'use strict';

var _ = require('lodash');

/**
 * Menu helper
 *
 * @param {Object} config
 * @constructor
 */
module.exports = function menuHelper(config) {

    var module = {
        /**
         * Checks if brand exists
         *
         * @returns {boolean}
         */
        hasBrand: function () {
            return Boolean(config.menu && config.menu.brand);
        },

        /**
         * Get menu brand link
         *
         * @returns {string}
         */
        getBrandLink: function() {
            if (!config.menu || !config.menu.brand || !_.isObject(config.menu.brand) || !config.menu.brand.link) {
                return '/admin';
            }
            return config.menu.brand.link;
        },

        /**
         * Get menu brand title
         *
         * @returns {string}
         */
        getBrandTitle: function() {
            if (!config.menu || !config.menu.brand) {
                return 'Dashboard';
            }
            if (_.isString(config.menu.brand)) {
                return config.menu.brand;
            }
            if (_.isObject(config.menu.brand) && _.isString(config.menu.brand.title)) {
                return config.menu.brand.title;
            }
            return 'Dashboard';
        },

        /**
         * Will create a list of groups to show
         *
         * @returns {Array}
         */
        getGroups: function () {
            var groups = config.menu.groups || [];
            _.forEach(groups, function(group, idx) {
                if (!group.key) return;
                // Clear menues to avoid data duplication
                groups[idx].menues = [];
                _.forEach(config.instances, function(val, key) {
                    if (val.menuGroup && val.menuGroup == group.key) {
                        groups[idx].menues.push({
                            link: config.routePrefix + '/' + key,
                            title: val.title,
                            icon: val.icon || null
                        });
                    }
                });
            });
            return groups;
        },

        /**
         * Get list of instance menues that was not binded to groups
         *
         * @returns {Array}
         */
        getInstanceMenues: function() {
            var menues = [];
            _.forEach(config.instances, function(val, key) {
                if (val.menuGroup) {
                    return;
                }
                menues.push({
                    link: config.routePrefix + '/' + key,
                    title: val.title,
                    icon: val.icon || null
                });
            });
            return menues;
        }
    };

    return module;
};
