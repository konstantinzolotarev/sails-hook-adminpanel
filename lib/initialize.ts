'use strict';

var _ = require('lodash');
var fs = require('fs');
var viewsHelper = require('../helper/viewsHelper');
import * as path from "path";
import bindAssets from "./bindAssets"


export default function ToInitialize(sails) {

    /**
     * List of hooks that required for adminpanel to work
     */
    var requiredHooks = [
        'blueprints',
        'controllers',
        'http',
        'orm',
        'policies',
        'views'
    ];

    return  async function initialize(cb) {

        // If disabled. Do not load anything
        if (!sails.config.adminpanel) {
            return cb();
        }

        // Set up listener to bind shadow routes when the time is right.
        //
        // Always wait until after router has bound static routes.
        // If policies hook is enabled, also wait until policies are bound.
        // If orm hook is enabled, also wait until models are known.
        // If controllers hook is enabled, also wait until controllers are known.
        var eventsToWaitFor = [];
        eventsToWaitFor.push('router:after');

        try {
            /**
             * Check hooks availability
             */
            _.forEach(requiredHooks, function (hook) {
                // if (!sails.hooks[hook]) {
                //     throw new Error('Cannot use `adminpanel` hook without the `' + hook + '` hook.');
                // }
                // eventsToWaitFor.push('hook:' + hook + ':loaded');
            });
        } catch(err) {
            if (err) {
                return cb(err);
            }
        }

        //Check views engine and check if folder with templates exist
        if (!fs.existsSync(viewsHelper.getPathToEngine(sails.config.views.extension))) {
            return cb(new Error('For now adminpanel hook could work only with Pug template engine.'));
        }

        var initAuth = require('./initializeAuthorization')(sails, cb);

        // sails.after(eventsToWaitFor, require('../lib/afterHooksLoaded')(sails));
        sails.on("lifted", require('../lib/afterHooksLoaded')(sails));

        sails.config.adminpanel.templateRootPath = viewsHelper.BASE_VIEWS_PATH;
        sails.config.adminpanel.rootPath = path.resolve(__dirname+"/..")

        // Bind assets
        await bindAssets(sails);
        cb();
    }
};
