$(function() {

    var cardSelector = $("#cardselector");

    // TODO: temp to avoid breaking all pages
    if (cardSelector.length === 0) {
        return;
    }
    var cardContainer = $("#cardcontainer");
    var cardDataContainer = $("#carddata");
    var cardData = cardDataContainer.data('cards');
    var cardSource = [];
    var selectedCards = [];
    $.each(cardData, function(index, card) {
        cardSource.push({
            label : card.name,
            value : card.id
        });
    });

    cardSelector.autocomplete({
        source: cardSource,
        focus: function( event, ui ) {
            $( "#cardselector" ).val( ui.item.label );
            return false;
        },
        select: function( event, ui ) {
            $( "#cardselector" ).val('');
            selectedCards.push(ui.item.value);
            cardContainer.append('<div data-card-id="' + ui.item.value + '">' + ui.item.label + '</div>');
            return false;
        }
    });

    $('#createdeck').click(function() {
        var data = {
            deckName: $('#deckname').val(),
            cards: selectedCards
        };
        $.post("/deck", data, function(deck) {
            window.location.replace("/deck/" + deck.deckId);
        });
    });
});