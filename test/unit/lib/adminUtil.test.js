'use strict';

var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();

var AdminUtil = require('../../../lib/adminUtil');

describe('adminUtil :: ', function() {

    //describe.skip('_getModelAttributes() :: ');
    //
    //describe.skip('config() :: ');
    //
    //describe.skip('findInstanceName() :: ');
    //
    //describe.skip('findConfig() :: ');

    describe('_isValidInstanceConfig() :: ', function() {

        it('fail if not Object given', function() {
            expect(AdminUtil._isValidInstanceConfig()).to.be.false();
            expect(AdminUtil._isValidInstanceConfig('')).to.be.false();
            expect(AdminUtil._isValidInstanceConfig(null)).to.be.false();
            expect(AdminUtil._isValidInstanceConfig(true)).to.be.false();
        });

        it('fail if no `model` exist', function() {
            expect(AdminUtil._isValidInstanceConfig({})).to.be.false();
            expect(AdminUtil._isValidInstanceConfig({model: 'User'})).to.be.true();
        });


    });
});
