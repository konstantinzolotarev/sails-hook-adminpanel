'use strict';

var util = require('../lib/adminUtil');
var views = require('../helper/viewsHelper');

var async = require('async');
var path = require('path');

module.exports = function(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    var instanceName = util.findInstanceName(req);
    var config = util.findConfig(req);
    if (!config.view) {
        return res.redirect(path.join(util.config().routePrefix, instanceName));
    }
    //Get model
    var Model = util.findModel(req);
    if (!Model) {
        return res.notFound();
    }
    Model.findOne(req.param('id'))
        .exec(function(err, record) {
            if (err) {
                sails.log.error('Admin edit error: ');
                sails.log.error(err);
                return res.serverError();
            }
            var fields = util.getFields(req, Model, 'view');

            res.view(views.getViewPath('view'), {
                instanceConfig: config,
                record: record,
                instanceName: instanceName,
                instancePath: path.join(util.config().routePrefix, instanceName),
                fields: fields
            });
        });
};
