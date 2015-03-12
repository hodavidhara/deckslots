var fullCardSet = require('./../resources/fullHearthstoneCardSet.json');
var properties = require('./../resources/properties.json');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

function dropCardCollection(db, callback) {
    db.dropCollection('cards', function(err, result) {
        if (err) {
            console.log('error dropping cards collection, this is probably because the collection does not exist');
            console.log(err);
        } else {
            console.log('successfully dropped card collection');
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
                console.log('inserted ' + card.name);
                singleCardCallback(err);
            });
        }, function (err) {
            if (err) {
                console.log('error inserting all cards in set ' + setName);
                console.log(err);
            } else {
                console.log('successfully inserted all cards in set ' + setName);
            }
            setCallback(err)
        });
    }, function(err) {
        if (err) {
            console.log('error inserting all cards');
            console.log(err);
        } else {
            console.log('successfully inserted all');
        }
        callback(err);
    });
}

var fullMongoUrl = 'mongodb://' + properties.mongo.username + ':' + properties.mongo.password + '@' + properties.mongo.url;
console.log('attempting to connect to ' + fullMongoUrl);
MongoClient.connect(fullMongoUrl, function (err, db) {
    if(err) throw err;

    async.series([
        function(callback) {
            console.log('dropping card collection');
            dropCardCollection(db, callback);
        }, function(callback) {
            console.log('beginning to insert cards');
            insertCards(db, callback);
        }, function(callback) {
            console.log('closing database connection');
            db.close(function(err) {
                callback(err);
            });
        }
    ], function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('success!');
        }
    });
});