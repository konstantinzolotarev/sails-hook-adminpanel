'use strict';
var util = require('../lib/adminUtil');
var requestProcessor = require('../lib/requestProcessor');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');

var path = require('path');
var async = require('async');

module.exports = function(req, res) {
    var Model = util.findModel(req);
    if (!Model) {
        return res.notFound();
    }
    var instanceConfig = util.findConfig(req);
    if (!instanceConfig.list.limit) {
        instanceConfig.list.limit = 15; //@todo move 15 to constant
    }
    //Limit check
    if (!_.isNumber(instanceConfig.list.limit)) {
        sails.log.error('Admin list error: limit option should be number. Reseived: ', instanceConfig.list.limit);
        instanceConfig.list.limit = 15;
    }
    //Check page
    var page = req.param('page') || 1;
    if (_.isFinite(page)) {
        page = parseInt(page) || 1;
    }

    var total = 0;
    var records = [];
    async.parallel([
        //Fetch total records for page
        function getTotalRecords(done) {
            Model.count()
                .exec(function(err, count) {
                    if (err) return done(err);
                    total = count;
                    done();
                });
        },
        // Loading list of records for page
        function loadRecords(done) {
            Model.find()
                .paginate({page: page, limit: instanceConfig.list.limit || 15})
                .exec(function(err, list) {
                    if (err) return done(err);
                    records = list;
                    done();
                });
        }
    ], function(err, result) {
        if (err) {
            sails.log.error('Admin list error: ');
            sails.log.error(err);
            return res.serverError(err);
        }
        var instanceName = util.findInstanceName(req);
        res.view(views.getViewPath('list'), {
            requestProcessor: requestProcessor,
            instanceConfig: instanceConfig,
            instanceName: instanceName,
            instancePath: path.join(util.config().routePrefix, instanceName),
            total: total,
            list: records,
            fields: fieldsHelper.getFields(req, Model, 'list')
        });
    });

};
