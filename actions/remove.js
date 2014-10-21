'use strict';

var util = require('../adminUtil');
var path = require('path');

module.exports = function(req, res) {
    //Checking id of the record
    if (!req.param('id')) {
        //@todo add json response
        sails.log.error(new Error('Admin panel: No id for record provided'));
        return res.notFound();
    }
    //Get model
    var Model = util.findModel(req);
    if (!Model) {
        //@todo add json response
        sails.log.error(new Error('Admin panel: no model found'));
        return res.notFound();
    }
    //Get instance name
    var instanceName = util.findInstanceName(req);
    var config = util.findConfig(req);
    if (!config.remove) {
        return res.redirect(path.join(sails.config.admin.routePrefix, instanceName));
    }
    /**
     * Searching for record by model
     */
    Model
        .findOne(req.param('id'))
        .exec(function(err, record) {
            if (err) {
                if (req.wantsJSON) {
                    return res.json({
                        success: false,
                        message: err.message
                    });
                }
                sails.log.error(err);
                return res.serverError();
            }
            if (!record) {
                var msg = 'Admin panel: No record found with id: ' + req.param('id');
                if (req.wantsJSON) {
                    return res.json({
                        success: false,
                        message: msg
                    });
                }
                return res.notFound();
            }
            record.destroy(function(err) {
                if (req.wantsJSON) {
                    return res.json({
                        success: true,
                        message: 'Record was removed successfuly'
                    });
                }
                req.flash('adminSuccess', 'Record was removed successfuly');
                res.redirect(path.join(sails.config.admin.routePrefix, instanceName));
            });
        });
};