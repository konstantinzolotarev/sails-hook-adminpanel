var util = require('../helper/liftUtil');
var _ = require('lodash');

var expect = require('chai').expect;
var Sails = require('sails').Sails;

describe('Adminpanel cofigure :: ', function() {
    var app;

    before(function(done) {
        Sails().lift(util.getAppConfig(), function(err, sails) {
            app = sails;
            return done(err);
        });
    });

    after(function(done) {
        app.lower(function (err) {
            return done();
        });
    });

    describe('`views.locals` config :: ', function() {

        it('adminpanel object should exist', function(done) {
            expect(app.config.views.locals.adminpanel).to.exist
                .and.to.be.instanceOf(Object);
            done();
        });
    });
});
