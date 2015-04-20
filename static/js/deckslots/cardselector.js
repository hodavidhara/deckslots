require(['jquery', 'jquery-ui/ui/autocomplete'], function($, autocomplete) {

    // Grab the necessary card data to populate the selector
    $.getJSON("/card", function(cardData) {

        var cardSelector = $("#cardselector");
        var cardContainer = $("#cardcontainer");
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
});