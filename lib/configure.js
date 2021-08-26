'use strict';

module.exports = function ToConfigure(sails) {

    return function configure() {
        // Check for disable admin panel
        if (!sails.config.adminpanel) {
            return;
        }
        // Add hooks here
        sails.config.adminpanel.hooks=[];
        sails.config.adminpanel.styles=[];
        sails.config.adminpanel.script={};
        sails.config.adminpanel.script.header=[];
        sails.config.adminpanel.script.footer=[];
        
        //recheck reoute prefix
        sails.config.adminpanel.routePrefix = sails.config.adminpanel.routePrefix || '/admin';
        //check and adding base slash
        if (sails.config.adminpanel.routePrefix.indexOf('/') != 0) {
            sails.config.adminpanel.routePrefix = '/' + sails.config.adminpanel.routePrefix;
        }
    };
};
