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
        var regExp = new RegExp('^\\'+sails.config.admin.routePrefix+'\\/(\\w+).*$');
        var matches = req.path.match(regExp);
        if (!matches || !matches[1]) {
            req._sails.log.error('No match found for admin');
            return null;
        }
        return matches[1];
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
        //Get keys from config
        var fieldList = _.keys(actionConfig);
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
            var config = actionConfig[key] || { title: key };
            if (_.isString(config)) {
                config = {
                    title: config
                };
            }
            //check title
            if (!config['title']) {
                config['title'] = key;
            }
            result[key] = {
                config: config,
                model: field
            };
        });
        return result;
    }
};