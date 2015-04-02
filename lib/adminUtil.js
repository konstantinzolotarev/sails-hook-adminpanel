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
    _getModelAttributes: function(model) {
        if (!model || !model.attributes) {
            return {};
        }
        return _.pick(model.attributes, function(val, key) {
//                return (_.isPlainObject(val) && !val.collection);
            return _.isPlainObject(val);
        });
    },

    /**
     * Check if given instance config has all required properties
     *
     * @param {Object} config
     * @returns {boolean}
     * @private
     */
    _isValidInstanceConfig: function(config) {
        if (!_.isObject(config) || !_.isString(config.model)) {
            return false;
        }
        return true;
    },

    /**
     * Normalizing instance config.
     * Will retirn fulfilled configuration object.
     *
     * @see AdminUtil._isValidInstanceConfig
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    _normalizeInstanceConfig: function(config) {
        if (!this._isValidInstanceConfig(config)) {
            req._sails.log.error('Wrong instance configuration, using default');
            config = {};
        }
        _.defaults(config, this._defaultInstanceConfig);
        //Check limits
        if (_.isBoolean(config.list)) {
            config.list = {
                limit: 15
            };
        }
        if (!_.isNumber(config.list.limit)) {
            config.list.limit = 15;
        }
        return config;
    },

    /**
     * Normalize action config object
     *
     * @param {Object} config
     * @returns {Object}
     * @private
     */
    _normalizeActionConfig: function(config) {
        //Adding fields
        config.fields = config.fields || {};
        _.defaults(config, this._defaultActionConfig);
        //check just to be sure that we will have object
        if (!_.isPlainObject(config.fields)) {
            config.fields = {};
        }
        return config;
    },

    /**
     * Get admin panel config
     *
     * @returns {Object}
     */
    config: function() {
        return sails.config.adminpanel || {};
    },

    /**
     * Get model from system
     *
     * @param {string} name
     * @returns {?Model}
     */
    getModel: function(name) {
        //Getting model
        var Model = sails.models[name.toLowerCase()];
        if (!Model) {
            if (!sails) {
                console.log('No model found in sails.');
            } else {
                sails.log.error('No model found in sails.');
            }
            return null;
        }
        return Model;
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
     * @param {String} instanceName
     * @returns {?Object}
     */
    findInstanceConfig: function findConfig(req, instanceName) {
        if (!this.config().instances || !this.config().instances[instanceName]) {
            req._sails.log.error('No such route exists');
            return null;
        }
        return this._normalizeInstanceConfig(this.config().instances[instanceName] || {});
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
     * @param {Object} instance Instance object with `name`, `config`, `model` {@link AdminUtil.findInstanceObject}
     * @param {string} actionType Type of action that config should be loaded for. Example: list, edit, add, remove, view.
     * @returns {Object} Will return object with configs or default configs.
     */
    findActionConfig: function(instance, actionType) {
        if (!instance || !actionType) {
            throw new Error('No `instance` or `actionType` passed !');
        }
        var result = _.defaults({}, this._defaultActionConfig);
        if (!instance.config || !instance.config[actionType]) {
            return result;
        }
        /**
         * Here we could get true/false so need to update it to Object for later manipulations
         * In this function
         */
        if (_.isBoolean(instance.config[actionType])) {
            return result;
        }
        return this._normalizeActionConfig(instance.config[actionType]);
    },

    /**
     * Trying to find model by request
     *
     * @see AdminUtil._isValidInstanceConfig
     * @param {Request} req
     * @param {Object} instanceConfig
     * @returns {?Model}
     */
    findModel: function findModel(req, instanceConfig) {
        if (!this._isValidInstanceConfig(instanceConfig)) {
            return null;
        }
        return this.getModel(instanceConfig.model);
    },

    /**
     * Will create instance object from request.
     *
     * Instance Object will have this format:
     *
     * @example
     * ```javascript
     * {
     *  name: 'user',
     *  model: Model,
     *  config: { ... },
     *  uri: ''
     * }
     * ```
     *
     * @param req
     * @returns {Object}
     */
    findInstanceObject: function(req) {
        var instance = {};
        instance.name = this.findInstanceName(req);
        instance.config = this.findInstanceConfig(req, instance.name);
        instance.model = this.findModel(req, instance.config);
        instance.uri = path.join(this.config().routePrefix, instance.name);
        return instance;
    }
};

module.exports = AdminUtil;
