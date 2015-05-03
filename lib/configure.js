'use strict';

module.exports = function ToConfigure(sails) {

    return function configure() {
        //recheck reoute prefix
        sails.config.adminpanel.routePrefix = sails.config.adminpanel.routePrefix || '/admin';
        //check and adding base slash
        if (sails.config.adminpanel.routePrefix.indexOf('/') != 0) {
            sails.config.adminpanel.routePrefix = '/' + sails.config.adminpanel.routePrefix;
        }
    };
};
