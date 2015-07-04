"use strict";
define([
    'lodash',
    'jquery',
    'hbs!deckslots/templates/card'
], function(_, $, cardTemplate) {

    var DeckDisplay = function (config) {
        this.domNode = config.domNode;

        if (config.decklist) {
            this.decklist = config.decklist;
            _.forEach(this.decklist, function (card) {
                this.domNode.append($(cardTemplate({card: card})));
            }, this);
        } else {
            this.decklist = [];
        }
    };

    DeckDisplay.prototype.addCard = function (card) {
        this.decklist.push(card);
        this.domNode.append($(cardTemplate({card: card})));
    };

    DeckDisplay.prototype.removeCard = function (card) {
        var index = _.findIndex(this.decklist, card);
        if (index > -1) {
            _.pullAt(this.decklist, index);
            this.domNode.remove('div[data-card-id="' + card.id + '"]');
        } else {
            throw Error('Card does not exist in decklist');
        }
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