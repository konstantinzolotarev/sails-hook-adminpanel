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
    var fields = fieldsHelper.getFields(req, instance, 'view');

    var query = instance.model
        .findOne(req.param('id'))
        .populateAll();

    //fieldsHelper.getFieldsToPopulate(fields).forEach(function(val) {
    //    query.populate(val);
    //});
    query.exec(function(err, record) {
            if (err) {
                req._sails.log.error('Admin edit error: ');
                req._sails.log.error(err);
                return res.serverError();
            }
            res.viewAdmin({
                instance: instance,
                record: record,
                fields: fields
            });
        });
};
