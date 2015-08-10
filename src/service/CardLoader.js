"use strict";
var _ = require('lodash'),
    Card = require('../model/Card'),
    logger = require('../logger'),
    fullCardSet = require('../../resources/fullHearthstoneCardSet.json');

var CardLoader = function () {
};

CardLoader.prototype.load = function () {
    return _dropCardCollection()
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

var _dropCardCollection = function () {
    return new Promise(function (resolve, reject) {
        Card.remove({}, function(err, result) {
            if (err) {
                logger.warn('error dropping cards collection, this is probably because the collection does not exist', err);
            } else {
                logger.info('successfully dropped card collection');
            }
            resolve();
        });
    });
};

var _insertCards = function () {
    return new Promise(function (resolve, reject) {
        _.forIn(fullCardSet, function (cardSet, setName) {
            _.forEach(cardSet, function (card) {
                card.setName = setName;
                new Card(card).save(function (err, card) {
                    if (err) {
                        reject(err);
                    } else {
                        logger.info('inserted ' + card.name);
                    }
                });
            });
        });
        resolve();
    });
};

var service = new CardLoader();

module.exports = service;