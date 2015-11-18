"use strict";
require([
    'lodash',
    'jquery',
    'deckslots/deckservice',
    'deckslots/deckdisplay'
], function (_, $, DeckService, DeckDisplay) {

    // Grab the id from the path which looks like /deck/:id/:version
    var parts = window.location.pathname.split("/");
    var deckId = parts[2];
    var deckVersion = _.parseInt(parts[3]);

    var getDeckVersion = deckVersion ?
        DeckService.getDeckVersion.bind(this, deckId, deckVersion) :
        DeckService.getLatestDeckVersion.bind(this, deckId);

    getDeckVersion(function(deckVersion) {

        var deckDisplay = new DeckDisplay({
            domNode: $('#deckdisplay'),
            decklist: deckVersion
        });
    });
});