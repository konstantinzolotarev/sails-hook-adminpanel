var util = require('../helper/liftUtil');
var Sails = require('sails').Sails;
var expect = require('chai').expect;


describe('Adminpanel routes :: ', function() {
    var app;
    //
    //before(function(done) {
    //    console.log(32312312312312312312);
    //    Sails().lift(util.getAppConfig(), function(err, sails) {
    //        app = sails;
    //        return done(err);
    //    });
    //});
    //
    //after(function(done) {
    //    app.lower(function(err) {
    //        return done();
    //    });
    //});

    it('etser', function() {
        expect(sails.config.views).to.exist;
    });

});
