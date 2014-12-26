'use strict';

var Sails = require('sails').Sails;
var _ = require('lodash');

var expect = require('chai').expect;

var appConfig = {
    log: {level: 'warn'},
    hooks: {
        adminpanel: require('../..')
    },

    views: {
        engine: 'jade'
    },

    loadHooks: ['moduleloader', 'userconfig', 'adminpanel']
};

describe('HOOKs dependency :: ', function() {

    it('should fail without `blueprints`', function(done) {
        var app = Sails();
        app.lift(appConfig, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);

            done();
        });
    });

    it('should fail without `controllers`', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('blueprints');
        app.lift(appConfig, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);

            done();
        });
    });

    it('should fail without `http`', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('controllers');
        app.lift(appConfig, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);

            done();
        });
    });

    it('should fail without `orm`', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('http');
        app.lift(appConfig, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);

            done();
        });
    });

    it('should fail without `policies`', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('orm');
        app.lift(appConfig, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);

            done();
        });
    });

    it('should fail without `views`', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('policies');
        app.lift(appConfig, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);

            done();
        });
    });

    it('should fail if view engine is not `jade`', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('views');
        var cfg = _.clone(appConfig);
        delete cfg.views;
        app.lift(cfg, function(err) {

            expect(err).to.exist
                .and.to.be.instanceOf(Error);
            app.lower(done);
        });
    });

    it('should successfuly lift with all hooks', function(done) {
        var app = Sails();
        appConfig.loadHooks.push('views');
        app.lift(appConfig, function(err) {

            expect(err).not.to.exist;
            app.lower(done);
        });
    });
});
