var Sails = require('sails').Sails;
var _ = require('lodash');
// Use a weird port to avoid tests failing if we
// forget to shut down another Sails app
var TEST_SERVER_PORT = 1337;

module.exports = {

    TEST_PORT: TEST_SERVER_PORT,

    /**
     * Get default config for lifting
     */
    getAppConfig: function() {
        var config = {
            port: TEST_SERVER_PORT,
            log: {level: 'verbose'},
            hooks: {
                // Inject the adminpanel hook in this repo into this Sails app
                adminpanel: require('../..'),
                grunt: false,
                i18n: false
            },
            views: {
                engine: 'jade'
            }
            //loadHooks: ['moduleloader', 'userconfig', 'http', 'session', 'sockets']
        };
        return config;
    }//,

    //setup: function (done) {
    //    // New up an instance of Sails and lift it.
    //    var app = Sails();
    //    app.lift(this.getAppConfig(), function (err) {
    //        return done(err);
    //    });
    //},
    //
    //teardown: function (done) {
    //    // Tear down sails server
    //    global.sails.lower(function () {
    //        // Delete globals (just in case-- shouldn't matter)
    //        delete global.sails;
    //        return done();
    //    });
    //}
};
