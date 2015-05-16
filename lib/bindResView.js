'use strict';

var _ = require('lodash');
var path = require('path');
var viewHelper = require('../helper/viewsHelper');

module.exports = function(sails) {

    var bindResFunctions = function(req, res, next) {

        /**
         * Guess view name by request
         *
         * @param {IncomingMessage} req
         * @returns {string}
         */
        var guessViewName = function(req) {
            if (!req || !req.route || !req.route.path || !_.isString(req.route.path)) {
                return '';
            };
            var routeSplited = req.route.path.split('/');
            var viewName = routeSplited.pop();
            // :instance = list
            if (viewName === ':instance') {
                viewName = 'list';
            }
            // for id we need not last name
            if (viewName === ':id') {
                viewName = routeSplited.pop();
            }
            return viewName;
        };

        /**
         * Show
         */
        res.viewAdmin = function(/* specifiedPath, locals, cb_view */) {
            var specifiedPath = arguments[0];
            var locals = arguments[1];
            var cb_view = arguments[2];

            if (_.isObject(arguments[0])) {
                locals = arguments[0];
            }
            if (_.isFunction(arguments[1])) {
                cb_view = arguments[1];
            }
            if (!specifiedPath || !_.isString(specifiedPath)) {
                specifiedPath = guessViewName(res.req);
            }
            return res.view(viewHelper.getViewPath(specifiedPath), locals, cb_view);
        };

        next();
    };

    sails.router.bind(path.join(sails.config.adminpanel.routePrefix, '*'), bindResFunctions);
};
