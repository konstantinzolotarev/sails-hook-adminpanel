'use strict';

module.exports = function ToAfterHooksLoaded(sails) {

    return function afterHooksLoaded() {
        //binding all routes.
        require('./bindRoutes')(sails);

        // bind config for views
        require('./bindConfig')(sails);
    };
};
