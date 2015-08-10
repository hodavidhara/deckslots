"use strict";
require([
    'lodash',
    'jquery',
    'deckslots/deckdisplay',
    'deckslots/cardstore'
], function (_, $, DeckDisplay, CardStore) {

    // Grab the id from the path which looks like /deck/:id/:version
    var parts = window.location.pathname.split("/");
    var deckId = parts[2];
    var deckVersion = parts[3];

    $.getJSON('/deck/' + deckId, function(deck) {

        // If no version was passed in, just use the latest.
        var cardIds;
        if (deckVersion) {
            cardIds = _.find(deck.versions, {version: deckVersion});
        } else {
            cardIds = _.sortBy(deck.versions, 'version')[0].cards;
        }

        var decklist = CardStore.getCards(cardIds);

        var deckDisplay = new DeckDisplay({
            domNode: $('#deckdisplay'),
            decklist: decklist
        });
    });
});