'use strict';

var _ = require('lodash');
var path = require('path');

module.exports = {

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
     * Will generate path to view file
     *
     * @param {string} view
     * @returns {*}
     */
    getViewPath: function getViewPath(view) {
        return path.join(sails.config.admin.pathToViews, view);
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
        if (!req._sails.config.admin.instances[instance]) {
            req._sails.log.error('No such route exists');
            return null;
        }
        var route = req._sails.config.admin.instances[instance];
        if (!route || !_.isPlainObject(route) || !route.model) {
            req._sails.log.error('No model defined for route in admin panel');
            return null;
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
     * Will try to find all fields that should be used in model
     *
     * @param {Request} req
     * @param {Object} fields
     * @see #getFields to know what data should be passed into fields
     * @returns {Object}
     */
    findModelFields: function(req, fields) {
        var data = req.allParams();
        var result = _.pick(data, function(value, key) {
            return Boolean(fields[key]);
        });
        _.forIn(result, function(val, key) {
            var field = fields[key];
            if (field.model.type == 'boolean') {
                result[key] = Boolean(val);
            }
        });
        //Check or fields that was not passed
        _.forIn(fields, function(field, key) {
            if (!result[key] && field.model.type == 'boolean') {
                result[key] = false;
            }
        });
        //@todo prepare field values
        return result;
    },

    /**
     * Basicaly it will fetch all attributes without functions
     *
     * Result will be object with list of fields and its config.<br/>
     * <code>
     *  {
     *      "fieldName": {
     *          config: {
     *              title: "Field title",
     *              // ... Other config will be added here
     *          },
     *          model: {
     *              // Here will be list of properties from your model
     *          }
     *      }
     *  }
     * </code>
     *
     * @param {Request} req
     * @param {Model} model
     * @param {string} type
     * @returns {Object}
     */
    getFields: function getFields(req, model, type) {
        var config = this.findConfig(req);
        if (!model) {
            model = this.findModel(req);
        }
        if (!model || !model.attributes) {
            return [];
        }
        //get type of fields to show
        type = type || 'list';
        //get field config for actions
        var actionConfig = config[type] || {};
        //Adding fields
        actionConfig.fields = actionConfig.fields || {};
        //Get keys from config
        var fieldList = _.keys(actionConfig.fields);
        //Getting list of fields from model
        var attrs = _.pick(model.attributes, function(val, key) {
            if (fieldList.length == 0) {
                return _.isPlainObject(val) && !val.collection && !val.model;
            }
            return (~fieldList.indexOf(key) && _.isPlainObject(val) && !val.collection && !val.model);
        });
        // creating result
        var result = {};
        _.forEach(attrs, function(field, key) {
//            var model = field;
            var config = actionConfig.fields[key] || { title: key };
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
            config.required = Boolean(config.required || field.required);

            result[key] = {
                config: config,
                model: field
            };
        });
        return result;
    }
};