'use strict';

var _ = require('lodash');
var path = require('path');

var AdminUtil = {

    /**
     * Default configuration for instance
     *
     * @see AdminUtil.findConfig
     */
    _defaultInstanceConfig: {
        list: true,
        add: true,
        edit: true,
        remove: true,
        view: true
    },

    /**
     * Default configs that will be returned for action. If nothing exists in config file.
     *
     * @see AdminUtil.findActionConfig
     */
    _defaultActionConfig: {
        fields: {}
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
        if (!this.config().instances || !this.config().instances[instance]) {
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
     * Will get action config from configuration file depending to given action
     *
     * Config will consist of all configuration props from config file.
     *
     * @example
     *
     *  {
     *      'fields': {
     *          name: 'Name',
     *          email: true,
     *          anotherField: {
     *              title: 'Another field',
     *              //... some more options here
     *          }
     *      }
     *  }
     *
     * @throws {Error} if req or actionType not passed
     * @param {Request} req Request form Sails.js
     * @param {string} actionType Type of action that config should be loaded for. Example: list, edit, add, remove, view.
     * @returns {Object} Will return object with configs or default configs.
     */
    findActionConfig: function(req, actionType) {
        if (!req || !actionType) {
            throw new Error('No `req` or `actionType` passed !');
        }
        var result = _.defaults({}, this._defaultActionConfig);
        //Get config for action
        var config = this.findConfig(req);
        if (!config || !config[actionType]) {
            return result;
        }
        /**
         * Here we could get true/false so need to update it to Object for later manipulations
         * In this function
         */
        if (_.isBoolean(config[actionType])) {
            return result;
        }
        var resConfig = config[actionType];
        //Adding fields
        resConfig.fields = resConfig.fields || {};
        _.defaults(resConfig, this._defaultActionConfig);
        //check just to be sure that we will have object
        if (!_.isPlainObject(resConfig.fields)) {
            resConfig.fields = {};
        }
        return resConfig;
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
    }
};

module.exports = AdminUtil;
