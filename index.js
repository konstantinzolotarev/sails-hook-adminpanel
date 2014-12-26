'use strict';

module.exports = function (sails) {

    return {

        /**
         * Creating default settings for hook
         */
        defaults: require('./lib/defaults'),

        configure: require('./lib/configure')(sails),

        initialize: require('./lib/initialize')(sails)
    };
};
