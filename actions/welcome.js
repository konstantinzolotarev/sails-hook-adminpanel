'use strict';


/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
module.exports = function(req, res) {
    return res.viewAdmin('welcome',{ instance: "instance"});
};
