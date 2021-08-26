'use strict';

module.exports = function (sails) {

    return {

        /**
         * Creating default settings for hook
         */
        defaults: require('./lib/defaults'),

        configure: require('./lib/configure')(sails),

        initialize: require('./lib/initialize').default(sails),

        addMenuItem: function (link, label, icon, group) {
            if (!link)
                throw 'first argumant is required';

            sails.config.adminpanel.menu = sails.config.adminpanel.menu || {};
            sails.config.adminpanel.menu.actions = sails.config.adminpanel.menu.actions || [];
            sails.config.adminpanel.menu.actions.push({
                link: link,
                title: label || link,
                icon: icon,
                menuGroup: group
            });

            sails.config.views.locals.adminpanel.menuHelper = require('./helper/menuHelper')(sails.config.adminpanel);
        },

        addGroup: function (key, title) {
            if (!key)
                throw 'first argumant is required';

            sails.config.adminpanel.menu = sails.config.adminpanel.menu || {};
            sails.config.adminpanel.menu.groups = sails.config.adminpanel.menu.groups || [];
            sails.config.adminpanel.menu.groups.push({
                key: key,
                title: label || key,
            });
        }
    };
};

