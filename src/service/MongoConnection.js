var mongoose = require('mongoose'),
    config = require('konfig')(),
    logger = require('../logger');

var MongoConnection = function() {
    this.mongoUrl = "";
    this.options = {
        server: {
            socketOptions: { keepAlive: 1 }
        },
        replset: {
            socketOptions: { keepAlive: 1 }
        }
    };
    if (config.mongo.username) {
        this.mongoUrl = 'mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.url;
    } else {
        this.mongoUrl = 'mongodb://' + config.mongo.url;
    }
    mongoose.connect(this.mongoUrl, this.options);
};

var connection = new MongoConnection();

module.exports = connection;