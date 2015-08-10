"use strict";
define([
    'lodash',
    'jquery',
    'jquery-ui/ui/autocomplete',
    'deckslots/cardstore'
], function(_, $, autocomplete, CardStore) {

    var CardSelector = function (conf) {
        this.domNode = conf.domNode;
        this.onSelectCallback = conf.onSelect;
        this.cardSource = [];

        var that = this;

        this.loadCards(function () {
            that.domNode.autocomplete({
                source: that.cardSource,
                focus: function(event, ui) {
                    that.domNode.val(ui.item.label);
                    return false;
                },
                select: function(event, ui) {
                    that.onSelectCallback(event, ui);
                    that.domNode.val('');
                    return false;
                }
            });
        })
    };

    CardSelector.prototype.loadCards = function (callback) {
        var that = this;
        _.forEach(CardStore.cards, function(card) {
            that.cardSource.push({
                label : card.name,
                value : card.id,
                card: card
            });
        });
        callback();
    };

    return CardSelector;
});