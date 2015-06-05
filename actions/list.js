'use strict';

var _ = require('lodash');
var util = require('../lib/adminUtil');
var requestProcessor = require('../lib/requestProcessor');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');
var sortingHelper = require('../helper/sortingHelper');

var async = require('async');

module.exports = function(req, res) {
    var instance = util.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    //Limit check
    if (!_.isNumber(instance.config.list.limit)) {
        req._sails.log.error('Admin list error: limit option should be number. Reseived: ', instance.config.list.limit);
        instance.config.list.limit = 15;
    }
    //Check page
    var page = req.param('page') || 1;
    if (_.isFinite(page)) {
        page = parseInt(page) || 1;
    }

    var total = 0;
    var records = [];
    var fields = fieldsHelper.getFields(req, instance, 'list');

    //Processing sorting
    sortingHelper.processRequest(req);

    async.parallel([
        //Fetch total records for page
        function getTotalRecords(done) {
            instance.model.count()
                .exec(function(err, count) {
                    if (err) return done(err);
                    total = count;
                    done();
                });
        },
        // Loading list of records for page
        function loadRecords(done) {
            var query = instance.model.find();
            if (req.sort) {
                query.sort(req.sort.key + ' ' + req.sort.order);
            }
            fieldsHelper.getFieldsToPopulate(fields).forEach(function(val) {
                query.populate(val);
            });
            query.paginate({page: page, limit: instance.config.list.limit || 15})
                .exec(function(err, list) {
                    if (err) return done(err);
                    records = list;
                    done();
                });
        }
    ], function(err, result) {
        if (err) {
            req._sails.log.error('Admin list error: ');
            req._sails.log.error(err);
            return res.serverError(err);
        }
        res.viewAdmin({
            requestProcessor: requestProcessor,
            sortingHelper: sortingHelper,
            instance: instance,
            total: total,
            list: records,
            fields: fields
        });
    });

};
