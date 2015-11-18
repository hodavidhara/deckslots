"use strict";
define([
    'lodash',
    'jquery',
    'deckslots/cardstore'
], function (_, $, CardStore) {

    var DeckService = function () {};

    DeckService.prototype.getDeck = function (id, callback) {
        $.getJSON('/deck/' + id, function(deck) {
            callback(deck);
        });
    };

    DeckService.prototype.getDeckVersion = function (id, version, callback) {
        $.getJSON('/deck/' + id, function(deck) {
            var deckVersion = _.find(deck.versions, {version: version});
            var inflatedCards = CardStore.getCards(deckVersion.cards);
            callback(inflatedCards);
        });
    };

    DeckService.prototype.getLatestDeckVersion = function (id, callback) {
        $.getJSON('/deck/' + id, function(deck) {
            var deckVersion = _.find(deck.versions, {version: deck.versions.length});
            var inflatedCards = CardStore.getCards(deckVersion.cards);
            callback(inflatedCards);
        });
    };

    // singleton
    return new DeckService();
});