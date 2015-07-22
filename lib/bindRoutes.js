'use strict';

var path = require('path');

var _dashboard = require('../actions/dashboard');
var _list = require('../actions/list');
var _edit = require('../actions/edit');
var _add = require('../actions/add');
var _view = require('../actions/view');
var _remove = require('../actions/remove');
var _records = require('../actions/records');

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
     * Create a default dashboard
     * @todo define information that should be shown here
     */
    sails.router.bind(sails.config.adminpanel.routePrefix, _bindPolicies(policies, _dashboard));

    /**
     * Bind records searcher
     */
    sails.router.bind(sails.config.adminpanel.routePrefix + '/_records/:model', _bindPolicies(policies, _records));

};
