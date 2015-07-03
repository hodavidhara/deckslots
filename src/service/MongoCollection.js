var MongoConnection = require('./MongoConnection');

var MongoCollection = function(collectionName) {
    this.collectionName = collectionName;
    this.collection = null;
};

MongoCollection.prototype.get = function () {
    var p;
    var instance = this;
    if (this.collection) {
        console.log('Collection ', this.collectionName, ' is cached, returning cached object');
        p = Promise.resolve(this.collection);
    } else {
        console.log('Collection ', this.collectionName, ' is not cached, fetching.');
        p = _connectAndGetCollection(this.collectionName).then(function (collection) {
            instance.collection = collection;
            return collection;
        });
    }
    return p;
};

var _connectAndGetCollection = function (collectionName) {
    return new Promise(function (resolve, reject) {
        MongoConnection.get().then(function (db) {
            resolve(db.collection(collectionName));
        }); //TODO: should we catch here?
    });
};

module.exports = MongoCollection;