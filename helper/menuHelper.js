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
                return 'Sails-adminpanel';
            }
            if (_.isString(config.menu.brand)) {
                return config.menu.brand;
            }
            if (_.isObject(config.menu.brand) && _.isString(config.menu.brand.title)) {
                return config.menu.brand.title;
            }
            return 'Sails-adminpanel';
        },

        /**
         * Check if global actions buttons added to action
         *
         * @param {Object} instanceConfig
         * @param {string=} [action] Defaults to `list`
         * @returns {boolean}
         */
        hasGlobalActions: function(instanceConfig, action) {
            action = action || 'list';
            if (!instanceConfig[action] || !instanceConfig[action].actions || !instanceConfig[action].actions.global) {
                return false;
            }
            var actions = instanceConfig[action].actions.global;
            if (actions.length > 0) {
                return true;
            }
            return false;
        },

        /**
         * Check if inline actions buttons added to action
         *
         * @param {Object} instanceConfig
         * @param {string=} [action] Defaults to `list`
         * @returns {boolean}
         */
        hasInlineActions: function(instanceConfig, action) {
            action = action || 'list';
            if (!instanceConfig[action] || !instanceConfig[action].actions || !instanceConfig[action].actions.inline) {
                return false;
            }
            var actions = instanceConfig[action].actions.inline;
            if (actions.length > 0) {
                return true;
            }
            return false;
        },

        /**
         * Get list of custom global buttons for action
         *
         * @param {Object} instanceConfig
         * @param {string=} [action]
         * @returns {Array}
         */
        getGlobalActions: function(instanceConfig, action) {
            action = action || 'list';
            if (!this.hasGlobalActions(instanceConfig, action)) {
                return [];
            }
            return instanceConfig[action].actions.global;
        },

        /**
         * Get list of custom inline buttons for action
         *
         * @param {Object} instanceConfig
         * @param {string=} [action]
         * @returns {Array}
         */
        getInlineActions: function(instanceConfig, action) {
            action = action || 'list';
            if (!this.hasInlineActions(instanceConfig, action)) {
                return [];
            }
            return instanceConfig[action].actions.inline;
        },

        /**
         * Replace fields in given URL and binds to model fields.
         *
         * URL can contain different properties from given model in such notation `:propertyName`.
         * If model wouldn't have such property it will be left as `:varName`
         *
         * @param {string} url URL with list of variables to replace '/admin/test/:id/:title/'
         * @param {Object} model
         * @returns {string}
         */
        replaceModelFields: function(url, model) {
            // Check for model existance
            if (!model) {
                return url;
            }
            var words = _.words(url, /\:+[a-z\-_]*/gi);
            // Replacing props
            _.forEach(words, function(word) {
                var variable = word.replace(':', '');
                if (model && model[variable]) {
                    url = url.replace(word, model[variable]);
                }
            });
            return url;
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
                if (config.menu.actions && config.menu.actions.length > 0) {
                    _.forEach(config.menu.actions, function(menu) {
                        if (!menu.link || !menu.title || !menu.menuGroup || menu.menuGroup != group.key) {
                            return;
                        }
                        groups[idx].menues.push({
                            link: menu.link,
                            title: menu.title,
                            icon: menu.icon || null
                        });
                    });
                }
            });
            return groups;
        },

        /**
         * Get list of instance menues that was not binded to groups
         *
         * @returns {Array}
         */
        getMenuItems: function() {
            var menues = [];
            _.forEach(config.instances, function(val, key) {
                if (val.menuGroup) {
                    return;
                }
                if (val.actions && val.actions.length > 0 && val.actions[0].title !== "Overview") {
                    val.actions.unshift({
                        link: config.routePrefix + '/' + key,
                        title: "Overview",
                        icon: ""
                    })
                }
                menues.push({
                    link: config.routePrefix + '/' + key,
                    title: val.title,
                    icon: val.icon || null,
                    actions: val.actions || null,
                    id: val.id || val.title.replace(" ","_"),
                    instanceName: key
                });
            });
            if (config.menu.actions && config.menu.actions.length > 0) {
                _.forEach(config.menu.actions, function(menu) {
                    if (!menu.link || !menu.title || menu.menuGroup || menu.disabled) {
                        return;
                    }
                    menues.push({
                        link: menu.link,
                        title: menu.title,
                        id: menu.id || menu.title.replace(" ","_"),
                        icon: menu.icon || null
                    });
                });
            }
            return menues;
        }
    };

    return module;
};
