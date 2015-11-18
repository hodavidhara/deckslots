"use strict";
require([
    'jquery',
    'deckslots/deckservice',
    'deckslots/cardselector',
    'deckslots/editabledeckdisplay'
], function ($, DeckService, CardSelector, EditableDeckDisplay) {

    // Grab the id from the path which looks like /deck/:id
    var parts = window.location.pathname.split("/");
    var deckId = parts[2];

    var deckDisplay = new EditableDeckDisplay({
        domNode: $('#deckdisplay')
    });

    var cardSelector = new CardSelector({
        domNode: $('#cardselector'),
        onSelect: function (event, ui) {
            deckDisplay.addCard(ui.item.card)
        }
    });

    DeckService.getLatestDeckVersion(deckId, function (deck) {
        deckDisplay.loadDeck(deck);
    });

    $('#updatedeck').click(function() {
        var data = {
            cards: deckDisplay.getIds(),
            comment: ''
        };
        $.ajax({
            url: '/deck/' + deckId + '/v',
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