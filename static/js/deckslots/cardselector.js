"use strict";
define([
    'lodash',
    'jquery',
    'jquery-ui/ui/autocomplete'
], function(_, $) {

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
        $.getJSON("/card", function(cardData) {
            _.forEach(cardData, function(card) {
                that.cardSource.push({
                    label : card.name,
                    value : card.id,
                    card: card
                });
            });
            callback();
        });
    };

    return CardSelector;
});