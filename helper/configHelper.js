'use strict';

var _ = require('lodash');

module.exports = function(sails) {

    var config = sails.config.adminpanel;

    var ConfigHelper = {

        /**
         * Checks if given field is identifier of model
         *
         * @param {Object} field
         * @param {Object|string=} modelOrName
         * @returns {boolean}
         */
        isId: function(field, modelOrName) {
            return (field.config.key == this.getIdentifierField(modelOrName));
        },

        /**
         * Get configured `identifierField` from adminpanel configuration.
         *
         * If not configured and model passed try to guess it using `primaryKey` field in model.
         * If system couldn't guess will return 'id`.
         * Model could be object or just name (string).
         *
         * **Warning** If you will pass record - method will return 'id'
         *
         * @param {Object|string=} [model]
         * @returns {string}
         */
        getIdentifierField: function(modelOrName) {
            if (config.identifierField != 'id' || !modelOrName) {
                return config.identifierField;
            }
            var model;
            if (_.isString(modelOrName)) {
                model = sails.models[modelOrName.toLowerCase()];
            } else if (_.isObject(modelOrName) && _.isObject(modelOrName.definition)) {
                model = modelOrName;
            } else {
                return config.identifierField;
            }
            if (!model.definition) {
                return config.identifierField;
            }
            var identifier = _.result(_.find(model.definition, function(val, key) {
                if (val.primaryKey) {
                    return key;
                }
            }));
            return identifier || config.identifierField;
        },

        /**
         * Checks if CSRF protection enabled in website
         *
         * @returns {boolean}
         */
        isCsrfEnabled: function() {
            return (sails.config.csrf !== false);
        }
    };

    return ConfigHelper;
};
