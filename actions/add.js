'use strict';

var util = require('../adminUtil');
var path = require('path');

module.exports = function(req, res) {
    //Get model
    var Model = util.findModel(req);
    if (!Model) {
        return res.notFound();
    }
    var instanceName = util.findInstanceName(req);
    res.view(util.getViewPath('add'), {
        instanceName: instanceName,
        instancePath: path.join(sails.config.admin.routePrefix, instanceName),
        fields: util.getFields(req, Model, 'add')
    });
};