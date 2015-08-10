"use strict";
var MongoConnection = require('../../src/service/MongoConnection');
var CardLoader = require('../../src/service/CardLoader');

describe('CardLoader', function() {

    describe('#load()', function() {
        it('loads all cards into the database', function () {
            return expect(CardLoader.load()).to.eventually.be.ok;
        });
    });
});