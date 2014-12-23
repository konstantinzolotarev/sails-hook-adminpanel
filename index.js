'use strict';

module.exports = function (sails) {

    return {

        /**
         * Creating default settings for hook
         */
        defaults: require('./lib/defaults'),


        initialize: require('./lib/initialize')(sails)
    };
};
