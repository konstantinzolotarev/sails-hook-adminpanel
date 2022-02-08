'use strict';

var path = require('path');

var _login = require('../actions/login');

var superAdmin = 'isAdminpanelSuperAdmin';

module.exports = function bindAuthorization(sails) {
    /**
     * Router
     */
    var _bindPolicies = require('../lib/bindPolicies')(sails);
    var policies = sails.config.adminpanel.policies || '';
    var baseRoute = sails.config.adminpanel.routePrefix + '/:instance';
    sails.router.bind(baseRoute + '/login', _bindPolicies(policies, _login));
    sails.router.bind(baseRoute + '/logout', _bindPolicies(policies, _login));

    var apConfName = ['list', 'add', 'edit', 'remove', 'view'];
    var apConf = {
        title: 'Admin panel users',
        model: 'UserAP',
        permission: superAdmin
    };
    for (var i in apConfName) {
        var conf = {
            permission: superAdmin
        };
        if (apConfName[i] !== 'remove') {
            conf.fields = {
                id: true,
                passwordHashed: false,
                createdAt: false,
                updatedAt: false,
                permission: {
                    widget: 'JsonEditor',
                    JsonEditor: {
                        height: 100,
                        mode: 'tree',
                        modes: ['code', 'form', 'text', 'tree', 'view']
                    }
                },
                password: false
            }
        }
        if (apConfName[i] === 'add') {
            conf.fields.password = true;
        }
        apConf[apConfName[i]] = conf;
    }
    sails.config.adminpanel.instances['userap'] = apConf;
};

/**
 * Add method to check permission from controller
 */
sails.adminpanel = {};
sails.adminpanel.havePermission = (req, obj, action) => {
    action = path.basename(action).split('.')[0];
    if (!sails.config.adminpanel.auth)
        return true;
    if (action === '') {
        if (req.session.UserAP) {
            if (req.session.UserAP.permission) {
                if (!obj.permission) {
                    return true;
                }
            }
        }
    }
    if (req.session.UserAP) {
        if (req.session.UserAP.permission) {
            if (!Array.isArray(req.session.UserAP.permission)) {
                req.session.UserAP.permission = [req.session.UserAP.permission];
            }
            if (req.session.UserAP.permission.indexOf(superAdmin) >= 0) {
                return true;
            } else if (obj[action]) {
                if (typeof obj[action] === 'boolean')
                    return true;
                if (obj[action].permission) {
                    if (!Array.isArray(obj[action].permission)) {
                        obj[action].permission = [obj[action].permission];
                    }
                    for (var i in req.session.UserAP.permission) {
                        for (var j in obj[action].permission) {
                            if (req.session.UserAP.permission[i] === obj[action].permission[j]) {
                                return true;
                            }
                        }
                    }
                } else {
                    return true;
                }
            } else if (action === '') {
                if (obj.permission) {
                    if (!Array.isArray(obj.permission)) {
                        obj.permission = [obj.permission];
                    }
                    for (var i in req.session.UserAP.permission) {
                        for (var j in obj.permission) {
                            if (req.session.UserAP.permission[i] === obj.permission[j]) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}
sails.on('lifted', async function () {
    /**
     * Model
     */
    var conf;

    // Only in dev mode after drop
    if (sails.config.models.migrate !== 'drop') return;


    if (sails.config.adminpanel.admin) {
        conf = sails.config.adminpanel.admin;
    } else {
        var conf = {
            username: 'engineer',
            password: 'engineer'
        }
    }

    try {
        let user = await UserAP.findOne({username: conf.username})
        if (!user) {
            user = await UserAP.create({
                username: conf.username,
                password: conf.password,
                permission: [superAdmin]
            }).fetch()
            if (!user) sails.log.error("Can't create user!");
        }
    } catch (e) {
        sails.log.error(e);
    }

});
