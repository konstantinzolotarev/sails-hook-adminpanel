'use strict';

var _ = require('lodash');
var path = require('path');

var AdminUtil = {

    /**
     * Default configuration for instance
     */
    _defaultInstanceConfig: {
        list: true,
        add: true,
        edit: true,
        remove: true,
        view: true
    },

    /**
     * Create a fields config based on model and config
     *
     * @param {Model} Model
     * @param {Object} config route config from sails.config.admin.instances['route']
     * @param {string} type may be list, add or edit and should config pages
     * @returns {Object}
     * @private
     */
    _getFieldsConfig: function _fieldsConfig(Model, config, type) {
        var fieldList = _.keys(config[type] || {});
        if (fieldList.length == 0) {
            var attrs = this._getModelAttributes(Model);
//            fieldList

        }
    },

    /**
     * Will fetch list of model attributes
     *
     * @param {Model} model
     * @returns {Object}
     */
    _getModelAttributes: function _getModelAttributes(model) {
        if (!model || !model.attributes) {
            return {};
        }
        return _.pick(model.attributes, function(val, key) {
//                return (_.isPlainObject(val) && !val.collection);
            return _.isPlainObject(val);
        });
    },

    /**
     * Get admin panel config
     *
     * @returns {exports.adminpanel|Object}
     */
    config: function() {
        return sails.config.adminpanel || {};
    },

    /**
     * Get instance name
     *
     * @param {Request} req
     * @returns {?string}
     */
    findInstanceName: function(req) {
      if (!req.param('instance')) {
        return null;
      }
      return req.param('instance');
    },

    /**
     * Searches for config from admin panel
     *
     * @param {Request} req
     * @returns {?Object}
     */
    findConfig: function findConfig(req) {
        var instance = this.findInstanceName(req);
        if (!this.config().instances[instance]) {
            req._sails.log.error('No such route exists');
            return null;
        }
        var route = this.config().instances[instance];
        if (!route || !_.isPlainObject(route) || !route.model) {
            req._sails.log.error('No model defined for route in admin panel');
            return null;
        }
        //@todo check config of this instance
        _.defaults(route, this._defaultInstanceConfig);
        //Check limits
        if (_.isBoolean(route.list)) {
            route.list = {
                limit: 15
            };
        }
        return route;
    },

    /**
     * Trying to find model by request
     *
     * @param {Request} req
     * @returns {?Model}
     */
    findModel: function findModel(req) {
        var route = this.findConfig(req);
        if (!route) {
            return null;
        }
        //Getting model
        var Model = req._sails.models[route.model.toLowerCase()];
        if (!Model) {
            req._sails.log.error('No model found in sails.');
            return null;
        }
        return Model;
    },

    /**
     * Basicaly it will fetch all attributes without functions
     *
     * Result will be object with list of fields and its config.<br/>
     * <code>
     *  {
     *      "fieldName": {
     *          config: {
     *              key: 'fieldKeyFromModel'
     *              title: "Field title",
     *              type: "string", //Or any other type. Will be fetched from model if not defined in config
     *              // ... Other config will be added here
     *          },
     *          model: {
     *              // Here will be list of properties from your model
     *          }
     *      }
     *  }
     * </code>
     *
     * @param {Request} req Sails.js request object
     * @param {Model=} model if not model passed model will be automatically loaded
     * @param {string} type Type of action that config should be loaded for. Example: list, edit, add, remove, view
     * @returns {Object} Empty object or pbject with list of properties
     */
    getFields: function getFields(req, model, type) {
        var config = this.findConfig(req);
        if (!model) {
            model = this.findModel(req);
        }
        if (!model || !model.attributes) {
            return {};
        }
        //get type of fields to show
        type = type || 'list';
        //get field config for actions
        var actionConfig = config[type] || {};
        /**
         * Here we could get true/false so need to update it to Object for later manipulations
         * In this function
         */
        if (_.isBoolean(actionConfig)) {
            actionConfig = {};
        }
        //Adding fields
        actionConfig.fields = actionConfig.fields || {};
        //check just to be sure that we will have object
        if (!_.isPlainObject(actionConfig.fields)) {
            actionConfig.fields = {};
        }
        //Get keys from config
        var actionConfigFields = _.keys(actionConfig.fields);
        //Getting list of fields from model
        var modelAttributes = _.pick(model.attributes, function(val, key) {
            if (actionConfigFields.length == 0) {
                return (_.isPlainObject(val) || _.isString(val)) && !val.collection && !val.model;
            }
            return (~actionConfigFields.indexOf(key) && (_.isPlainObject(val) || _.isString(val)) && !val.collection && !val.model);
        });
        // creating result
        var result = {};
        _.forEach(modelAttributes, function(modelField, key) {
            /**
             * Checks for short type in waterline:
             * fieldName: 'string'
             */
            if (_.isString(modelField)) {
                modelField = {
                    type: modelField
                };
            }
            //Getting config form configuration file
            var config = actionConfig.fields[key] || { key: key, title: key };
            //additional check for key
            if (!config.key) {
                config.key = key;
            }
            //Check for short title setup.
            if (_.isString(config)) {
                config = {
                    title: config
                };
            }
            //check title
            if (!config['title']) {
                config['title'] = key;
            }
            //check required
            config.required = Boolean(config.required || modelField.required);
            /**
             * Default type for field.
             * Could be fetched form config file or file model if not defined in config file.
             */
            config.type = config.type || modelField.type;
            //Adding new field to resultset
            result[key] = {
                config: config,
                model: modelField
            };
        });
        return result;
    }
};

module.exports = AdminUtil;
