"use strict";
require([
    'jquery', 'deckslots/cardselector', 'deckslots/deckdisplay'
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
            cards: deckDisplay.getIds()
        };
        $.ajax({
            url: '/deck',
            method: 'POST',
            data: JSON.stringify(data),
            success: function(deck) {
                window.location.replace("/deck/" + deck.deckId);
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    });
});