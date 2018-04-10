/**
 * User.js
 *
 * @description :: User for authorization in adminpanel
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var passwordHash = require('password-hash');

module.exports = {
    attributes: {
        id: {
            type:'integer',
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: 'string',
        },
        password: {
            type: 'string'
        },
        passwordHashed: {
            type: 'string'
        },
        permission: {
            type: 'json'
        }
    },
    beforeCreate: (values, next) => {
        var hashed = passwordHash.generate(values.username + values.password);
        values.passwordHashed = hashed;
        values.password = '';
        return next();
    }
};
