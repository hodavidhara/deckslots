var _ = require('lodash'),
    Deck = require('../model/Deck'),
    shortId = require('shortid');

var DeckService = function() {
};

DeckService.prototype.createDeck = function(deck) {
    return new Promise(function(resolve, reject) {

        // If this is a brand new deck add some required fields.
        console.log(deck);
        if (!deck.versions[0].version) {
            deck.versions[0].version = 1;
        }

        console.log(deck);
        new Deck(deck).save(function (err, deck) {
            if (err) {
                reject(err);
                return;
            }
            resolve(deck);
        });
    });
};

DeckService.prototype.readDeck = function(id) {
    return new Promise(function(resolve, reject) {
        console.log(id);
        Deck.findById(id, function (err, deck) {
            if (err) {
                reject(err);
                return;
            }
            resolve(deck);
        });
    });
};

DeckService.prototype.updateDeck = function(deck) {

    if (!deck.version) {
        return service.createDeck(deck);
    } else {
        return new Promise(function(resolve, reject) {
            service.readDeck(deck._id).then(function(result) {
                deck.version = result.version + 1;
                deck.save(function (err, deck) {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(deck);
                });
            });
        });
    }
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
        Deck.find({"user": userId}, function (err, decks) {
            if(err) {
                reject(err);
                return;
            }

            resolve(decks);
        });
    });
};

var service = new DeckService();

module.exports = service;