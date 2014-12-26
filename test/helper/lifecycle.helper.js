var Sails = require('sails').Sails;

// Use a weird port to avoid tests failing if we
// forget to shut down another Sails app
var TEST_SERVER_PORT = 1577;

module.exports = {

    TEST_PORT: TEST_SERVER_PORT,

    setup: function (done) {
        // New up an instance of Sails and lift it.
        var app = Sails();

        app.lift({
            port: TEST_SERVER_PORT,
            log: {level: 'warn'},
            hooks: {
                // Inject the adminpanel hook in this repo into this Sails app
                adminpanel: require('../..')
            },
            views: {
                engine: 'jade'
            }
            //loadHooks: ['moduleloader', 'userconfig', 'http', 'session', 'sockets']
        }, function (err) {
            return done(err);
        });
    },

    teardown: function (done) {
        // Tear down sails server
        global.sails.lower(function () {
            // Delete globals (just in case-- shouldn't matter)
            delete global.sails;
            return done();
        });
    }
};
