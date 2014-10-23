'use strict';

var util = require('../adminUtil');

/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
module.exports = function(req, res) {
    return res.view(util.getViewPath('dashboard'));
};