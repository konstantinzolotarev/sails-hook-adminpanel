'use strict';

/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
module.exports = function(req, res) {
    return res.view(sails.config.admin.pathToViews+'index');
};