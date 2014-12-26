'use strict';

var bindRoutes = require('./bindRoutes');
var bindConfig = require('./bindConfig');

module.exports = function ToAfterHooksLoaded(sails) {

    return function afterHooksLoaded() {
        //binding all routes.
        bindRoutes(sails);

        // bind config for views
        bindConfig(sails);
    };
};
