var MongoCollection = require('./MongoCollection');

var CardService = function() {
    this.cardCollection = new MongoCollection('cards');
};

CardService.prototype.getCollectibleCards = function() {
    var query = {
        "collectible": true,
        "type": {
            "$nin": ["Hero"]
        }
    };
    return new Promise(function(resolve, reject) {
        service.cardCollection.get().then(function (collection) {
            collection.find(query).toArray(function(err, cards) {
                if(err){
                    reject(err);
                    return;
                }

                resolve(cards);
            });
        });
    });
};

var service = new CardService();

module.exports = service;