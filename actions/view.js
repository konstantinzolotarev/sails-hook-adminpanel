'use strict';

var util = require('../lib/adminUtil');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');

var async = require('async');

module.exports = function(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    var instance = util.findInstanceObject(req);
    if (!instance.config.view) {
        return res.redirect(instance.uri);
    }
    if (!instance.model) {
        return res.notFound();
    }
    instance.model.findOne(req.param('id'))
        .exec(function(err, record) {
            if (err) {
                req._sails.log.error('Admin edit error: ');
                req._sails.log.error(err);
                return res.serverError();
            }
            var fields = fieldsHelper.getFields(req, instance, 'view');

            res.view(views.getViewPath('view'), {
                instance: instance,
                record: record,
                fields: fields
            });
        });
};
