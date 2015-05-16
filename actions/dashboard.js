'use strict';

var util = require('../lib/adminUtil');
var views = require('../helper/viewsHelper');

/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
module.exports = function(req, res) {
    return res.viewAdmin('dashboard');
};
