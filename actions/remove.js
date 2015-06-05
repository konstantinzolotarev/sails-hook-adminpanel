'use strict';

var util = require('../lib/adminUtil');

module.exports = function(req, res) {
    //Checking id of the record
    if (!req.param('id')) {
        req._sails.log.error(new Error('Admin panel: No id for record provided'));
        return res.notFound();
    }
    var instance = util.findInstanceObject(req);
    if (!instance.model) {
        req._sails.log.error(new Error('Admin panel: no model found'));
        return res.notFound();
    }
    if (!instance.config.remove) {
        return res.redirect(instance.uri);
    }
    /**
     * Searching for record by model
     */
    instance.model
        .findOne(req.param('id'))
        .exec(function(err, record) {
            if (err) {
                if (req.wantsJSON) {
                    return res.json({
                        success: false,
                        message: err.message
                    });
                }
                return res.serverError(err);
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
                if (err) {
                    if (req.wantsJSON) {
                        return res.json({
                            success: false,
                            message: err.message || 'Record was not removed'
                        });
                    }
                    req.flash('adminError', err.message || 'Record was not removed');
                    return res.redirect(instance.uri);
                }
                if (req.wantsJSON) {
                    return res.json({
                        success: true,
                        message: 'Record was removed successfuly'
                    });
                }
                req.flash('adminSuccess', 'Record was removed successfuly');
                res.redirect(instance.uri);
            });
        });
};
