"use strict";
define([
    'lodash',
    'jquery',
    'hbs!deckslots/templates/card'
], function(_, $, cardTemplate) {

    var DeckDisplay = function (config) {
        this.domNode = config.domNode;

        if (config.decklist) {
            this.loadDeck(config.decklist);
        } else {
            this.decklist = [];
        }
    };

    DeckDisplay.prototype.loadDeck = function (deck) {
        this.decklist = deck;
        _.forEach(this.decklist, function (card) {
            this.domNode.append($(cardTemplate({card: card})));
        }, this);
    };

    DeckDisplay.prototype.getCards = function () {
       return this.decklist;
    };

    DeckDisplay.prototype.getIds = function () {
        return _.map(this.decklist, function (card) {
            return card.id;
        })
    };

    return DeckDisplay;
});