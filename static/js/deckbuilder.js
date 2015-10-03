"use strict";
require([
    'jquery',
    'deckslots/cardselector',
    'deckslots/deckdisplay'
], function ($, CardSelector, DeckDisplay) {

    var deckDisplay = new DeckDisplay({
        domNode: $('#deckdisplay')
    });

    var cardSelector = new CardSelector({
        domNode: $('#cardselector'),
        onSelect: function (event, ui) {
            deckDisplay.addCard(ui.item.card)
        }
    });

    $('#createdeck').click(function() {
        var data = {
            deckName: $('#deckname').val(),
            'class': $('#class').val(),
            versions: [{
                version: 1,
                cards: deckDisplay.getIds()
            }]
        };
        $.ajax({
            url: '/deck',
            method: 'POST',
            data: JSON.stringify(data),
            success: function(deck) {
                console.log(deck);
                window.location.replace("/deck/" + deck._id);
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    });
});