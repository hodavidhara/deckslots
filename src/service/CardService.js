var Card = require('../model/Card');

var CardService = function() {
};

CardService.prototype.getCollectibleCards = function() {
    var query = {
        "collectible": true,
        "type": {
            "$nin": ["Hero"]
        }
    };
    return new Promise(function(resolve, reject) {
        Card.find(query, function(err, cards) {
            if (err) {
                reject(err);
                return;
            }

            resolve(cards);
        });
    });
};

var service = new CardService();

module.exports = service;