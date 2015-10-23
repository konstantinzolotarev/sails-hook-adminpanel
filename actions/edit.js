'use strict';

var util = require('../lib/adminUtil');
var request = require('../lib/requestProcessor');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');

var async = require('async');
var _ = require('lodash');

module.exports = function(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    var instance = util.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    if (!instance.config.edit) {
        return res.redirect(instance.uri);
    }

    instance.model.findOne(req.param('id'))
        .populateAll()
        .exec(function(err, record) {
            if (err) {
                req._sails.log.error('Admin edit error: ');
                req._sails.log.error(err);
                return res.serverError();
            }
            var fields = fieldsHelper.getFields(req, instance, 'edit');
            var reloadNeeded = false;
            async.series([
                function loadAssociations(done) {
                    fieldsHelper.loadAssociations(fields, function(err, result) {
                        fields = result;
                        done();
                    });
                },

                function checkPost(done) {
                    if (req.method.toUpperCase() !== 'POST') {
                        return done();
                    }
                    var reqData = request.processRequest(req, fields);
                    _.merge(record, reqData); // merging values from request to record
                    var params = {};
                    params[req._sails.config.adminpanel.identifierField] = req.param('id');
                    instance.model.update(params, reqData).exec(function(err, newRecord) {
                        if (err) {
                            req._sails.log.error(err);
                            req.flash('adminError', err.details || 'Something went wrong...');
                            return done(err);
                        }
                        req.flash('adminSuccess', 'Your record was updated !');
                        reloadNeeded = true;
                        return done();
                    });
                },

                function reloadIfNeeded(done) {
                    if (!reloadNeeded) {
                        return done();
                    }
                    instance.model.findOne(req.param('id'))
                        .populateAll()
                        .exec(function(err, reloadedRecord) {
                            if (err) {
                                req._sails.log.error('Admin edit error: ');
                                req._sails.log.error(err);
                                return res.serverError();
                            }
                            record = reloadedRecord;
                            return done();
                        });
                }
            ], function(err) {
                res.viewAdmin({
                    instance: instance,
                    record: record,
                    fields: fields
                });
            });
        });
};
