var expect = require('chai').expect,
    MongoConnection = require('../../src/service/MongoConnection');

describe('MongoConnection', function() {
    describe('#get()', function(){
        it('gets a mongo connection', function (done) {
            expect(MongoConnection.get()).to.eventually.be.ok;
        })
    });
});