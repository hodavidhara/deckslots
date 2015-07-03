var config = require('konfig')();
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../src/logger');

function dropCardCollection(db, callback) {
    db.dropCollection('cards', function(err, result) {
        if (err) {
            logger.error('error dropping cards collection, this is probably because the collection does not exist', err);
        } else {
            logger.info('successfully dropped card collection');
        }
        callback(null, result);
    });
}

function insertCards(db, callback) {
    var cardCollection = db.collection('cards');

    async.each(Object.keys(fullCardSet), function (setName, setCallback) {
        var cardSet = fullCardSet[setName];
        async.each(cardSet, function(card, singleCardCallback) {
            card.setName = setName;
            cardCollection.insert(card, function (err) {
                logger.info('inserted ' + card.name);
                singleCardCallback(err);
            });
        }, function (err) {
            if (err) {
                logger.error('error inserting all cards in set ' + setName, err);
            } else {
                logger.info('successfully inserted all cards in set ' + setName);
            }
            setCallback(err)
        });
    }, function(err) {
        if (err) {
            logger.error('error inserting all cards', errr);
        } else {
            logger.info('successfully inserted all');
        }
        callback(err);
    });
}

var fullMongoUrl = 'mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.url;
logger.info('attempting to connect to ' + fullMongoUrl);
MongoClient.connect(fullMongoUrl, function (err, db) {
    if(err) throw err;

    async.series([
        function(callback) {
            logger.info('dropping card collection');
            dropCardCollection(db, callback);
        }, function(callback) {
            logger.info('beginning to insert cards');
            insertCards(db, callback);
        }, function(callback) {
            logger.info('closing database connection');
            db.close(function(err) {
                callback(err);
            });
        }
    ], function(err) {
        if (err) {
            logger.error(err);
        } else {
            logger.info('success!');
        }
    });
});