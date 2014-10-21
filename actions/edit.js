'use strict';

var util = require('../adminUtil');
var async = require('async');
var path = require('path');

module.exports = function(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    //Get model
    var Model = util.findModel(req);
    if (!Model) {
        return res.notFound();
    }

    var instanceName = util.findInstanceName(req);
    var config = util.findConfig(req);
    if (!config.edit) {
        return res.redirect(path.join(sails.config.admin.routePrefix, instanceName));
    }

    Model.findOne(req.param('id'))
        .exec(function(err, record) {
            if (err) {
                sails.log.error('Admin edit error: ');
                sails.log.error(err);
                return res.serverError();
            }
            var fields = util.getFields(req, Model, 'edit');

            async.series([
                function checkPost(done) {
                    if (req.method.toUpperCase() !== 'POST') {
                        return done();
                    }
                    var reqData = util.findModelFields(req, fields);
                    _.merge(record, reqData); //merging values from request to record
                    Model.update({id: record.id}, reqData).exec(function(err) {
                        if (err) {
                            sails.log.error(err);
                            req.flash('adminError', err.details || 'Something went wrong...');
                            return done(err);
                        }
                        req.flash('adminSuccess', 'Your record was updated !');
                        return done();
                    });
                }
            ], function(err) {
                res.view(util.getViewPath('edit'), {
                    instanceConfig: config,
                    record: record,
                    instanceName: instanceName,
                    instancePath: path.join(sails.config.admin.routePrefix, instanceName),
                    fields: fields
                });
            });
        });
};