"use strict";
define([
    'lodash',
    'jquery'
], function (_, $) {

    var CardStore = function () {
        this.cards = {};

        var that = this;
        _loadCards(function (cards) {
            _.forEach(cards, function (card) {
                that.cards[card.id] = card;
            })
        });
    };

    /**
     *
     * @param {string[]} [ids]
     * @returns {Array}
     */
    CardStore.prototype.getCards = function (ids) {
        var that = this;
        if (ids) {
            var matchingCards = [];
            _.forEach(ids, function (id) {
                if (that.cards[id]) {
                    matchingCards.push(that.cards[id]);
                } else {
                    console.warn('No card found with id ', id);
                }
            });
            return matchingCards;
        } else {
            return _.values(this.cards);
        }
    };

    CardStore.prototype.getCard = function (id) {
        return this.cards[id];
    };

    var _loadCards = function (callback) {
        $.getJSON("/card", function(cardData) {
            callback(cardData);
        });
    };

    // singleton
    return new CardStore();
});