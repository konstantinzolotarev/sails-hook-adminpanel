'use strict';
var flash = require('connect-flash');
import * as bindAuthorization from './bindAuthorization'

module.exports = function ToAfterHooksLoaded(sails) {
    sails.hooks.http.app.use(flash());
    return function afterHooksLoaded() {
        // Binding list of function for rendering
        require('./bindResView')(sails);

        // bind config for views
        require('./bindConfig')(sails);

        //binding all routes.
        require('./bindRoutes')(sails);

        //binding authorization
        bindAuthorization(sails);
    };
};
