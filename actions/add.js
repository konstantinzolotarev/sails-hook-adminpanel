'use strict';

var util = require('../lib/adminUtil');
var request = require('../lib/requestProcessor');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');

var async = require('async');
var path = require('path');

module.exports = function(req, res) {
    //Get model
    var Model = util.findModel(req);
    if (!Model) {
        return res.notFound();
    }
    var fields = fieldsHelper.getFields(req, Model, 'add');
    var instanceName = util.findInstanceName(req);
    var config = util.findConfig(req);
    if (!config.add) {
        return res.redirect(path.join(util.config().routePrefix, instanceName));
    }
    var data = {}; //list of field values
    async.series([
        function checkPost(done) {
            if (req.method.toUpperCase() === 'POST') {
                var reqData = request.processRequest(req, fields);
                Model.create(reqData).exec(function(err, record) {
                    if (err) {
                        sails.log.error(err);
                        req.flash('adminError', err.details || 'Something went wrong...');
                        data = reqData;
                        return done(err);
                    }
                    req.flash('adminSuccess', 'Your record was created !');
                    return done();
                });
            } else {
                done();
            }
        }
    ], function(err) {
        res.view(views.getViewPath('add'), {
            instanceConfig: config,
            instanceName: instanceName,
            instancePath: path.join(util.config().routePrefix, instanceName),
            fields: fields,
            data: data
        });
    });

};
