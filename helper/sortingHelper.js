'use strict';

var requestProcessor = require('../lib/requestProcessor');


module.exports = {

    /**
     * Processing sorting from request object
     *
     * @param {*} req
     * @returns {?Object}
     */
    processRequest: function(req) {
        var sort = req.param('sort');
        // No sorting
        if (!sort) {
            return;
        }
        // Wrong sorting
        if (sort.split(':').length != 2) {
            return;
        }
        var sorting = sort.split(':');
        req.sort = {
            key: sorting[0],
            order: sorting[1]
        };
        return req.sort;
    },

    /**
     * Generate soring link
     *
     * @param {*} req
     * @param {string} key
     * @returns {string}
     */
    generateLink: function(req, key) {
        var sort = key + ':' + (req.sort && req.sort.order == 'asc' ? 'desc' : 'asc');
        return '?' + requestProcessor.addGetParams(req, {sort: sort});
    }
};
