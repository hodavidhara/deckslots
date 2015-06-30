var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    properties = require('../../resources/properties.json');

var CardService = function() {
    this.mongoUrl = "";
    if (properties.mongo.username) {
        this.mongoUrl = 'mongodb://' + properties.mongo.username + ':' + properties.mongo.password + '@' + properties.mongo.url;
    } else {
        this.mongoUrl = 'mongodb://' + properties.mongo.url;
    }
    console.log('CardService attempting to connect to ' + this.mongoUrl);
    var service = this;
    MongoClient.connect(this.mongoUrl, function(err, db) {
        if(err) {
            throw err;
        }

        console.log('CardService successfully connected.');
        service.db = db;
        service.cardCollection = db.collection('cards');
    });
};

CardService.prototype.getCollectibleCards = function() {
    var service = this;
    var query = {
        "collectible": true,
        "type": {
            "$nin": ["Hero"]
        }
    };
    return new Promise(function(resolve, reject) {
        service.cardCollection.find(query).toArray(function(err, cards) {
            if(err){
                reject(err);
                return;
            }

            resolve(cards);
        });
    });
};

module.exports = new CardService();