'use strict';
var util = require('../lib/adminUtil');
var async = require('async');
var _ = require('lodash');
module.exports = {
    /**
     * Will normalize a field configuration that willl be loaded fro config file.
     *
     * Input parameters should be different.
     *
     * For now AdminPanel hook supports such notations into field configurations:
     *
     * + Boolean notation
     *
     * ```
     *  fieldName: true // will enable field showing/editing
     *  fieldName: false // will remove field from showing. Could be usefull for actions like edit
     * ```
     *
     * + String natation
     *
     * ```
     *  fieldName: "Field Ttitle"
     * ```
     *
     * + Object notation
     *
     * ```
     *  fieldName: {
     *      title: "Field title", // You can overwrite field title
     *      type: "string", //you can overwrite default field type in admin panel
     *      required: true, // you can mark field required or not
     *      editor: true, // you can add WYSTYG editor for the field in admin panel
     *  }
     * ```
     *
     * There are several places for field config definition and an inheritance of field configs.
     *
     * 1. You could use a global `fields` property into `config/adminpanel.js` file into `instances` section.
     * 2. You could use `fields` property into `instances:action` confguration. This config will overwrite global one
     *
     * ```
     *  module.exports.adminpanel = {
     *      instances: {
     *          users: {
     *              title: 'Users', //Menu title for instance
     *              model: 'User', // Model definition for instance
     *
     *              fields: {
     *                  email: 'User Email', //it will define title for this field in all actions (list/add/edit/view)
     *                  createdAt: false, // Will hide createdAt field in all actions
     *                  bio: {
     *                      title: 'User bio',
     *                      editor: true
     *                  } // will set title `User bio` for the field and add editor into add/edit actions
     *              },
     *              // Action level config
     *              list: {
     *                  bio: false // will hide bio field into list view
     *              },
     *
     *              edit: {
     *                  createdAt: 'Created at' //will enable field `createdAt` and set title to `Created at`
     *              }
     *          }
     *      }
     *  }
     * ```
     *
     * @example
     *
     *  //default field config should llok like:
     *  var fieldConfig = {
     *      key: 'fieldKeyFromModel'
     *      title: "Field title",
     *      type: "string", //Or any other type. Will be fetched from model if not defined in config
     *      // ... Other config will be added here
     *  };
     *
     * @throws {Error} if no config or key passed
     * @param {*} config
     * @param {string} key
     * @returns {boolean|Object}
     * @private
     */
    _normalizeFieldConfig: function (config, key, modelField) {
        if (_.isUndefined(config) || _.isUndefined(key)) {
            throw new Error('No `config` or `key` passed !');
        }
        /**
         * check for boolean notation
         */
        if (_.isBoolean(config)) {
            if (!config) {
                return false;
            }
            else {
                return {
                    key: key,
                    title: key
                };
            }
        }
        // check for string notation
        if (_.isString(config)) {
            return {
                key: key,
                title: config
            };
        }
        //check for object natation
        if (_.isPlainObject(config)) {
            // make required checks
            if (!config.key) {
                config.key = key;
            }
            if (!config.title) {
                config.title = key;
            }
            //validate associations
            // console.log(modelField);
            if (config.type === 'association' || config.type === 'association-many') {
                var associatedModelAtrubutes = {};
                var displayField;
                if (config.type === 'association') {
                    try {
                        associatedModelAtrubutes = util.getModel(modelField.model.toLowerCase()).attributes;
                    }
                    catch (e) {
                        sails.log.error(e);
                    }
                }
                else if (config.type === 'association-many') {
                    try {
                        // console.log('admin > helper > collection > ', util.getModel(modelField.collection.toLowerCase()).attributes);
                        associatedModelAtrubutes = util.getModel(modelField.collection.toLowerCase()).attributes;
                    }
                    catch (e) {
                        sails.log.error(e);
                    }
                }
                // console.log('admin > helper > model > ', associatedModelAtrubutes);
                if (associatedModelAtrubutes.hasOwnProperty('name')) {
                    displayField = 'name';
                }
                else if (associatedModelAtrubutes.hasOwnProperty('label')) {
                    displayField = 'label';
                }
                else {
                    displayField = 'id';
                }
                _.defaults(config, {
                    identifierField: 'id',
                    displayField: displayField
                });
            }
            return config;
        }
        return false;
    },
    /**
     * Load list of records for all associations into `fields`
     *
     * @param {Object} fields
     * @param {function=} [cb]
     */
    loadAssociations: function (fields, cb) {
        cb = cb || function () { };
        /**
         * Load all associated records for given field key
         *
         * @param {string} key
         * @param {function=} [cb]
         */
        var loadAssoc = function (key, cb) {
            if (fields[key].config.type !== 'association' && fields[key].config.type !== 'association-many') {
                return cb();
            }
            fields[key].config.records = [];
            var modelName = fields[key].model.model || fields[key].model.collection;
            if (!modelName) {
                sails.log.error('No model found for field: ', fields[key]);
                return cb();
            }
            var Model = util.getModel(modelName);
            if (!Model) {
                return cb();
            }
            Model.find().exec(function (err, list) {
                if (err) {
                    return cb();
                }
                fields[key].config.records = list;
                cb();
            });
        };
        async.each(_.keys(fields), loadAssoc, function (err) {
            if (err) {
                return cb(err);
            }
            return cb(null, fields);
        });
    },
    /**
     * Create list of populated models
     *
     * @param {Object} fields
     * @returns {Array}
     */
    getFieldsToPopulate: function (fields) {
        var result = [];
        _.forEach(fields, function (field, key) {
            if (field.config.type === 'association' || field.config.type === 'association-many') {
                result.push(key);
            }
        });
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
     *              key: 'fieldKeyFromModel'
     *              title: "Field title",
     *              type: "string", //Or any other type. Will be fetched from model if not defined in config
     *              // ... Other config will be added here
     *          },
     *          model: {
     *              // Here will be list of properties from your model
     *              type: 'string' //...
     *          }
     *      }
     *  }
     * </code>
     *
     * @param {Request} req Sails.js req object
     * @param {Object} instance Instance object with `name`, `config`, `model` {@link AdminUtil.findInstanceObject}
     * @param {string=} [type] Type of action that config should be loaded for. Example: list, edit, add, remove, view. Defaut: list
     * @returns {Object} Empty object or pbject with list of properties
     */
    getFields: function (req, instance, type) {
        if (!instance.model || !instance.model.attributes) {
            return {};
        }
        //get type of fields to show
        type = type || 'list';
        //get field config for actions
        var actionConfig = util.findActionConfig(instance, type);
        var fieldsConfig = instance.config.fields || {};
        //Get keys from config
        //var actionConfigFields = _.keys(actionConfig.fields);
        //Getting list of fields from model
        let modelAttributes = instance.model.attributes

        console.log("<<<<",modelAttributes)

        var that = this;
        /**
         * Iteration function for every field
         *
         * @param {Object} modelField
         * @param {string} key
         * @private
         */
        var _prepareField = function (modelField, key) {
            /**
             * Checks for short type in waterline:
             * fieldName: 'string'
             */
            if (_.isString(modelField)) {
                modelField = {
                    type: modelField
                };
            }
            if (_.isObject(modelField) && modelField.model) {
                modelField.type = 'association';
            }
            if (_.isObject(modelField) && modelField.collection) {
                modelField.type = 'association-many';
            }
            if (type === 'add' && key === req._sails.config.adminpanel.identifierField) {
                return;
            }
            //Getting config form configuration file
            var fldConfig = { key: key, title: key };
            var ignoreField = false; // if set to true, field will be removed from editor/list
            //Checking global instance fields configuration
            if (fieldsConfig[key] || fieldsConfig[key] === false) {
                //if config set to false ignoring this field
                if (fieldsConfig[key] === false) {
                    ignoreField = true;
                }
                else {
                    var tmpCfg = that._normalizeFieldConfig(fieldsConfig[key], key, modelField);
                    _.merge(fldConfig, tmpCfg);
                }
            }
            //Checking inaction instance fields configuration. Should overwrite global one
            if (actionConfig.fields[key] || actionConfig.fields[key] === false) {
                //if config set to false ignoring this field
                if (actionConfig.fields[key] === false) {
                    ignoreField = true;
                }
                else {
                    var tmpCfg = that._normalizeFieldConfig(actionConfig.fields[key], key, modelField);
                    ignoreField = false;
                    _.merge(fldConfig, tmpCfg);
                }
            }
            if (ignoreField) {
                return;
            }
            //check required
            fldConfig.required = Boolean(fldConfig.required || modelField.required);
            /**
             * Default type for field.
             * Could be fetched form config file or file model if not defined in config file.
             */
            fldConfig.type = fldConfig.type || modelField.type;
            // All field types should be in lower case
            fldConfig.type = fldConfig.type.toLowerCase();
            //nomalizing configs
            fldConfig = that._normalizeFieldConfig(fldConfig, key, modelField);
            //Adding new field to resultset
            result[key] = {
                config: fldConfig,
                model: modelField
            };
        };
        // creating result
        var result = {};
        _.forEach(modelAttributes, _prepareField);
        return result;
    }
};
