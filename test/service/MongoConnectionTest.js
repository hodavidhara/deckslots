var expect = require('chai').expect,
    MongoConnection = require('../../src/service/MongoConnection');

describe('MongoConnection', function() {
    describe('#get()', function(){
        it('gets a mongo connection', function (done) {
            MongoConnection.get().then(function(db) {
                expect(db).to.be.ok;
                done();
            })
        })
    });
});