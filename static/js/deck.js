"use strict";
require([
    'jquery',
    'deckslots/deckdisplay',
    'deckslots/cardstore'
], function ($, DeckDisplay, CardStore) {

    // Grab the id from the path which looks like /deck/:id
    var deckId = window.location.pathname.split("/")[2];
    $.getJSON('/deck/' + deckId, function(deck) {
        var decklist = CardStore.getCards([deck.cards]);

        var deckDisplay = new DeckDisplay({
            domNode: $('#deckdisplay'),
            decklist: decklist
        });
    });
});