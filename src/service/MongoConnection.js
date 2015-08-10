var mongoose = require('mongoose'),
    config = require('konfig')(),
    logger = require('../logger');

var MongoConnection = function() {
    this.mongoUrl = "";
    if (config.mongo.username) {
        this.mongoUrl = 'mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.url;
    } else {
        this.mongoUrl = 'mongodb://' + config.mongo.url;
    }
    mongoose.connect(this.mongoUrl);
};

var connection = new MongoConnection();

module.exports = connection;