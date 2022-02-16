'use strict';


/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
module.exports = function(req, res) {

    if (!req.session.UserAP && sails.config.adminpanel.auth) {
        return res.redirect('/admin/userap/login');
    }

    return res.viewAdmin('welcome',{ instance: "instance"});
};
