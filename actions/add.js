'use strict';

var util = require('../lib/adminUtil');
var request = require('../lib/requestProcessor');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');

var async = require('async');

module.exports = function(req, res) {
    var instance = util.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    if (!instance.config.add) {
        return res.redirect(instance.uri);
    }

    if (!sails.adminpanel.havePermission(req, instance.config, __filename))
        return res.redirect('/admin/userap/login');

    var fields = fieldsHelper.getFields(req, instance, 'add');
    var data = {}; //list of field values
    async.series([
        function loadAssociations(done) {
            fieldsHelper.loadAssociations(fields, function(err, result) {
                fields = result;
                done();
            });
        },

        function checkPost(done) {
            if (req.method.toUpperCase() === 'POST') {
                var reqData = request.processRequest(req, fields);
                for(let prop in reqData){
                    if(fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== ''){
                        try{
                            reqData[prop] = JSON.parse(reqData[prop]);
                        }catch(e){
                            sails.log.error(e);
                        }
                    }
                }
                instance.model.create(reqData).exec(function(err, record) {
                    if (err) {
                        req._sails.log.error(err);
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
        return res.viewAdmin({
            instance: instance,
            fields: fields,
            data: data
        });
    });

};
