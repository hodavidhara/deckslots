var expect = require('chai').expect,
    MongoConnection = require('../../src/service/MongoConnection');

describe('MongoConnection', function() {
    describe('#get()', function(){
        it('gets a mongo connection', function () {
            return expect(MongoConnection.get()).to.eventually.be.ok
        });
    });
});