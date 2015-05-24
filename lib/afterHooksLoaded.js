'use strict';

module.exports = function ToAfterHooksLoaded(sails) {

    return function afterHooksLoaded() {
        // Binding list of function for rendering
        require('./bindResView')(sails);

        // bind config for views
        require('./bindConfig')(sails);

        //binding all routes.
        require('./bindRoutes')(sails);
    };
};
