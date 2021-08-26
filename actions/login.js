'use strict';

var passwordHash = require('password-hash');
var created = false;

module.exports = function(req, res) {
    if (req.url.indexOf('login') >= 0) {
        if (req.method.toUpperCase() === 'POST') {
            var username = req.param('username');
            var password = req.param('password');
            UserAP.findOne({username: username}).exec((err, user) => {
                if (err) return res.serverError(err);
                if (!user) return res.notFound();
                if (passwordHash.verify(username + password, user.passwordHashed)) {
                    req.session.UserAP = user;
                    res.redirect('/admin/');
                } else {
                    res.forbidden('Wrong username/password');
                }
            });
        } else if (req.method.toUpperCase() === 'GET') {
            return res.viewAdmin('login');
        }
    } else if (req.url.indexOf('logout') >= 0) {
        req.session.UserAP = undefined;
        res.redirect('/admin/');
    }
};
