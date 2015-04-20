var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    properties = require('../../resources/properties.json'),
    shortId = require('shortid');

var DeckService = function() {
    this.mongoUrl = 'mongodb://' + properties.mongo.username + ':' + properties.mongo.password + '@' + properties.mongo.url;
    console.log('DeckService attempting to connect to ' + this.mongoUrl);
    var service = this;
    MongoClient.connect(this.mongoUrl, function(err, db) {
        if(err) {
            throw err;
        }

        console.log('DeckService successfully connected.');
        service.db = db;
        service.deckCollection = db.collection('decks');
    });
};

DeckService.prototype.createDeck = function(deck) {
    var service = this;
    return new Promise(function(resolve, reject) {

        // If this is a brand new deck add some required fields.
        if (!deck.deckId) {
            deck.deckId = shortId.generate();
            deck.version = 1;
        }

        service.deckCollection.insert(deck, function(err, result) {
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

DeckService.prototype.readDeck = function(id) {
    var service = this;
    return new Promise(function(resolve, reject) {
        var objectId = new ObjectID(id);
        service.deckCollection.findOne({"_id": objectId}, function(err, result) {
            if(err){
                reject(err);
                return;
            }

            resolve(result);
        });
    });
};

DeckService.prototype.updateDeck = function(deck) {
    var service = this;
    return new Promise(function(resolve, reject) {
        if (!deck.version) {
            service.createDeck(deck).then(function(result) {
                resolve(result);
            }, function(err) {
                reject(err);
            });
        } else {
            service.getLatestVersionOfDeck(deck.deckId).then(function(result) {
                deck.version = result.version + 1;
                service.deckCollection.insert(deck, function(err, result) {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
        }
    });
};

DeckService.prototype.getAllDeckVersions = function(deckId) {
    var service = this;
    return new Promise(function(resolve, reject) {
        service.deckCollection.find({"deckId": deckId}, {"sort": "version"}).toArray(function(err, deckVersions) {
            if(err) {
                reject(err);
                return;
            }

            resolve(deckVersions);
        });
    });
};

DeckService.prototype.getLatestVersionOfDeck = function(deckId) {
    var service = this;
    return new Promise(function(resolve, reject) {
        service.getAllDeckVersions(deckId).then(function(allVersions) {
            resolve(allVersions[allVersions.length - 1]);
        }, function(err) {
            reject(err);
        })
    });
};

module.exports = new DeckService();