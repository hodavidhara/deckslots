var MongoConnection = require('./MongoConnection'),
    logger = require('../logger');

var MongoCollection = function(collectionName) {
    this.collectionName = collectionName;
    this.collection = null;
};

MongoCollection.prototype.get = function () {
    var p;
    var instance = this;
    if (this.collection) {
        logger.info('Collection ', this.collectionName, ' is cached, returning cached object');
        p = Promise.resolve(this.collection);
    } else {
        logger.info('Collection ', this.collectionName, ' is not cached, fetching.');
        p = _connectAndGetCollection(this.collectionName).then(function (collection) {
            instance.collection = collection;
            return collection;
        }).catch(function (error) {
            instance.collection = null;
            return Promise.reject(error);
        });
    }
    return p;
};

var _connectAndGetCollection = function (collectionName) {
    return new Promise(function (resolve, reject) {
        MongoConnection.get().then(function (db) {
            resolve(db.collection(collectionName));
        }).catch(function (err) {
            reject('Error getting mongo connection', err);
        });
    });
};

module.exports = MongoCollection;