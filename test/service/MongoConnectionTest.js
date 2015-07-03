var MongoConnection = require('../../src/service/MongoConnection'),
    MongoClient = require('mongodb').MongoClient;

describe('MongoConnection', function() {
    beforeEach(function () {
        MongoConnection.db = null;
    });

    describe('#get()', function() {
        it('gets a mongo connection', function () {
            return expect(MongoConnection.get()).to.eventually.be.ok
        });

        it('does not try to connect if it already has a connection', function (done) {
            var connectSpy = sinon.spy(MongoClient, 'connect');
            MongoConnection.get().then(function () {
                expect(MongoConnection.db).to.be.ok;
                expect(connectSpy).to.have.been.calledOnce;
                return;
            }).then(function () {
                MongoConnection.get().then(function () {
                    expect(MongoConnection.db).to.be.ok;
                    expect(connectSpy).to.have.been.calledOnce;

                    connectSpy.restore();
                    done();
                });
            });
        });

        it('reconnects to mongo if it loses its connection', function (done) {
            var connectSpy = sinon.spy(MongoClient, 'connect');
            MongoConnection.get().then(function () {
                expect(MongoConnection.db).to.be.ok;
                expect(connectSpy).to.have.been.calledOnce;
                MongoConnection.db = null;
                return;
            }).then(function () {
                MongoConnection.get().then(function () {
                    expect(MongoConnection.db).to.be.ok;
                    expect(connectSpy).to.have.been.calledTwice;

                    connectSpy.restore();
                    done();
                });
            });
        });
    });
});