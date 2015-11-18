"use strict";
define([
    'lodash',
    'jquery',
    'hbs!deckslots/templates/removablecard'
], function(_, $, cardTemplate) {

    var EditableDeckDisplay = function (config) {
        this.domNode = config.domNode;

        if (config.decklist) {
            this.loadDeck(config.decklist);
        } else {
            this.decklist = [];
        }
    };

    EditableDeckDisplay.prototype.addCard = function (card) {
        this.decklist.push(card);
        _.bind(_addCardNode, this);
    };

    EditableDeckDisplay.prototype.loadDeck = function (deck) {
        this.decklist = deck;
        _.forEach(this.decklist, _addCardNode, this);
    };

    EditableDeckDisplay.prototype.removeCard = function (card) {
        var index = _.findIndex(this.decklist, card);
        if (index > -1) {
            _.pullAt(this.decklist, index);
            this.domNode.children('div[data-card-id="' + card.id + '"]').remove();
        } else {
            throw Error('Card does not exist in decklist');
        }
    };

    EditableDeckDisplay.prototype.getCards = function () {
        return this.decklist;
    };

    EditableDeckDisplay.prototype.getIds = function () {
        return _.map(this.decklist, function (card) {
            return card.id;
        })
    };

    var _addCardNode = function (card) {
        var cardNode = $(cardTemplate({card: card}));
        cardNode.children('.remover').click(_.bind(function () {
            this.removeCard(card);
        }, this));
        this.domNode.append(cardNode);
    };

    return EditableDeckDisplay;
});