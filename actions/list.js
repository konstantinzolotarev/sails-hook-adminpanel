'use strict';
var util = require('../adminUtil');
var path = require('path');

module.exports = function(req, res) {
    var Model = util.findModel(req);
    if (!Model) {
        return res.notFound();
    }
    //Check page
    var page = req.param('page') || 0;
    if (!_.isNumber(page) || !_.isFinite(page)) {
        page = parseInt(page) || 0;
    }
    Model.find()
        .paginate({page: page})
        .exec(function(err, list) {
            if (err) {
                sails.log.error('Admin list error: ');
                sails.log.error(err);
                return res.serverError();
            }
            var instanceName = util.findInstanceName(req);
            res.view(util.getViewPath('list'), {
                list: list,
                instanceName: instanceName,
                instancePath: path.join(sails.config.admin.routePrefix, instanceName),
                fields: util.getFields(req, Model, 'list')
            });
        });
};