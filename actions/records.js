'use strict';

var _ = require('lodash');
var util = require('../lib/adminUtil');

/**
 * Try to load list of records by given model name
 */
module.exports = function(req, res) {
    if (!req.param('model')) {
        return res.json([]);
    }
    var modelName = req.param('model');
    var model = util.getModel(modelName);
    // No model found ?
    if (!model) {
        return res.json([]);
    }

    var limit = 30;
    var skip = parseInt(req.param('skip')) || 0;
    var order = 'id DESC';

    model.find()
        .limit(limit)
        .skip(skip * limit)
        .sort(order)
        .exec(function(err, list) {
            if (err) {
                return res.serverError(err);
            }
            return res.json(list);
        });
};
