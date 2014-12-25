'use strict';

var util = require('../lib/adminUtil');

module.exports = {

    /**
     * Checks if given field is identifier of model
     *
     * @param {Object} field
     * @returns {boolean}
     */
    isId: function(field) {
        return (field.config.key == util.config().identifierField);
    }
};
