//'use strict';
//
//var util = require('../helper/liftUtil');
//
//var Sails = require('sails').Sails;
//var _ = require('lodash');
//
//var expect = require('chai').expect;
//
//var appConfig = {
//    log: {level: 'warn'},
//    hooks: {
//        // Inject the adminpanel hook in this repo into this Sails app
//        adminpanel: require('../..'),
//        grunt: false
//    },
//    views: {
//        engine: 'jade'
//    },
//    loadHooks: ['moduleloader', 'userconfig', 'adminpanel']
//};
//
//var app;
//
//describe.skip('Adminpanel dependency :: ', function() {
//
//    it('should fail without `blueprints`', function(done) {
//        app = Sails();
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            app.lower(done);
//        });
//    });
//
//    it('should fail without `controllers`', function(done) {
//        app = Sails();
//        appConfig.loadHooks.push('blueprints');
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            app.lower(done);
//        });
//    });
//
//    it('should fail without `http`', function(done) {
//        app = Sails();
//        appConfig.loadHooks.push('controllers');
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            app.lower(done);
//        });
//    });
//
//    it('should fail without `orm`', function(done) {
//        app = Sails();
//        appConfig.loadHooks.push('http');
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            app.lower(done);
//        });
//    });
//
//    it('should fail without `policies`', function(done) {
//        app = Sails();
//        appConfig.loadHooks.push('orm');
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            app.lower(done);
//        });
//    });
//
//    it('should fail without `views`', function(done) {
//        app = Sails();
//        appConfig.loadHooks.push('policies');
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            app.lower(done);
//        });
//    });
//
//    it('should fail if view engine is not `jade`', function(done) {
//        app = Sails();
//        appConfig.loadHooks.push('views');
//        appConfig.views.engine = 'ejs';
//        app.load(appConfig, function(err) {
//
//            expect(err).to.exist
//                .and.to.be.instanceOf(Error);
//
//            appConfig.views.engine = 'jade';
//            app.lower(done);
//        });
//    });
//
//    it('should successfuly lift with all hooks', function(done) {
//        app = Sails();
//        app.load(appConfig, function(err) {
//
//            expect(err).not.to.exist;
//            app.lower(done);
//        });
//    });
//});
