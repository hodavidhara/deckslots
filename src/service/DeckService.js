var _ = require('lodash'),
    MongoCollection = require('./MongoCollection'),
    ObjectID = require('mongodb').ObjectID,
    shortId = require('shortid');

var DeckService = function() {
    this.deckCollection = new MongoCollection('decks');
};

DeckService.prototype.createDeck = function(deck) {
    return new Promise(function(resolve, reject) {

        // If this is a brand new deck add some required fields.
        if (!deck.deckId) {
            deck.deckId = shortId.generate();
            deck.version = 1;
        }

        service.deckCollection.get().then(function (collection) {
           collection.insert(deck, function(err, result) {
               if (err) {
                   reject(err);
                   return;
               }
               resolve(result);
           });
        });
    });
};

DeckService.prototype.readDeck = function(id) {
    return new Promise(function(resolve, reject) {
        var objectId = new ObjectID(id);

        service.deckCollection.get().then(function (collection) {
            collection.findOne({"_id": objectId}, function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    });
};

DeckService.prototype.updateDeck = function(deck) {

    if (!deck.version) {
        return service.createDeck(deck);
    } else {
        return new Promise(function(resolve, reject) {
            service.getLatestVersionOfDeck(deck.deckId).then(function(result) {
                deck.version = result.version + 1;
                service.deckCollection.get().then(function (collection) {
                    collection.insert(deck, function(err, result) {
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                });
            });
        });
    }
};

DeckService.prototype.getAllDeckVersions = function(deckId) {
    return new Promise(function(resolve, reject) {
        service.deckCollection.get().then(function (collection) {
            collection.find({"deckId": deckId}, {"sort": "version"}).toArray(function(err, deckVersions) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(deckVersions);
            });
        });
    });
};

DeckService.prototype.getLatestVersionOfDeck = function(deckId) {
    return new Promise(function(resolve, reject) {
        service.getAllDeckVersions(deckId).then(function(allVersions) {
            resolve(allVersions[allVersions.length - 1]);
        }, function(err) {
            reject(err);
        })
    });
};

/**
 * Get all of a given users decks.
 *
 * @param {object|string} user either the user object, or the user id as a strong.
 * @returns {Promise} A promise that will resolve to an array of decks.
 */
DeckService.prototype.getDecksForUser = function(user) {
    var userId = _.isObject(user) ? user._id : user;
    return new Promise(function (resolve, reject) {
        service.deckCollection.get().then(function (collection) {
            collection.find({"user": userId}).toArray(function(err, decks) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(decks);
            });
        });
    });
};

var service = new DeckService();

module.exports = service;