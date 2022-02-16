'use strict';

var path = require('path');

var _dashboard = require('../actions/dashboard');
var _welcome = require('../actions/welcome');

var _list = require('../actions/list');
var _list_json = require('../actions/list_json');
var _edit = require('../actions/edit');
var _add = require('../actions/add');
var _view = require('../actions/view');
var _remove = require('../actions/remove');
var _upload = require('../actions/upload');

module.exports = function bindRoutes(sails) {

    var _bindPolicies = require('../lib/bindPolicies')(sails);

    /**
     * List or one policy that should be binded to actions
     * @type {string|Array}
     */
    var policies = sails.config.adminpanel.policies || '';

    //Create a base instance route
    var baseRoute = sails.config.adminpanel.routePrefix + '/:instance';

    /**
     * List of records
     */
    sails.router.bind(baseRoute, _bindPolicies(policies, _list));
    sails.router.bind(baseRoute+"/json", _bindPolicies(policies, _list_json));
    /**
     * Create new record
     */
    sails.router.bind(baseRoute + '/add', _bindPolicies(policies, _add));
    /**
     * View record details
     */
    sails.router.bind(baseRoute + '/view/:id', _bindPolicies(policies, _view));
    /**
     * Edit existing record
     */
    sails.router.bind(baseRoute + '/edit/:id', _bindPolicies(policies, _edit));
    /**
     * Remove record
     */
    sails.router.bind(baseRoute + '/remove/:id', _bindPolicies(policies, _remove));
    /**
     * Upload files
     */
    sails.router.bind(baseRoute + '/upload', _bindPolicies(policies, _upload));
    /**
     * Create a default dashboard
     * @todo define information that should be shown here
     */

    if (Boolean(sails.config.adminpanel.dashboard)) {
        sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, _dashboard));
    } else {
        sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, _welcome));
    }

};
