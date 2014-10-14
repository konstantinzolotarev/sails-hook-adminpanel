'use strict';

var util = require('../adminUtil');
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
    Model.findOne(req.param('id'))
        .exec(function(err, record) {
            if (err) {
                sails.log.error('Admin edit error: ');
                sails.log.error(err);
                return res.serverError();
            }
            var instanceName = util.findInstanceName(req);
            res.view(util.getViewPath('edit'), {
                record: record,
                instanceName: instanceName,
                instancePath: path.join(sails.config.admin.routePrefix, instanceName),
                fields: util.getFields(req, Model, 'edit')
            });
        });
};