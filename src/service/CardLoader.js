"use strict";
var MongoCollection = require('./MongoCollection'),
    MongoConnection = require('./MongoConnection'),
    logger = require('../logger'),
    fullCardSet = require('../../resources/fullHearthstoneCardSet.json');

var CardLoader = function () {
    this.cardCollection = new MongoCollection('cards');
};

CardLoader.prototype.load = function () {
    return MongoConnection.get()
        .then(_dropCardCollection)
        .then(_insertCards)
        .then(function () {
            return {
                success: true
            }
        })
        .catch(function (error) {
            logger.error('Error trying to load the cardset into the database', error);
            return {
                success: false,
                error: error.message
            };
        });
};

var _dropCardCollection = function (db) {
    return new Promise(function (resolve, reject) {
        db.dropCollection('cards', function (err) {
            if (err) {
                logger.warn('error dropping cards collection, this is probably because the collection does not exist', err);
            } else {
                logger.info('successfully dropped card collection');

            }
            resolve(db);
        });
    });
};

var _insertCards = function () {
    return service.cardCollection.get().then(function (collection) {
        Object.keys(fullCardSet).forEach(function (setName) {
            var cardSet = fullCardSet[setName];
            cardSet.forEach(function (card) {
                card.setName = setName;
                collection.insert(card, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        logger.info('inserted ' + card.name);
                    }
                });
            });
        });
    });
};

var service = new CardLoader();

module.exports = service;