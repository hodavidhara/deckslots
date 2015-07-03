var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    config = require('konfig')(),
    logger = require('../logger');

/**
 * Sets the appropriate connection url.
 *
 * @constructor
 */
var MongoConnection = function() {
    this.mongoUrl = "";
    if (config.mongo.username) {
        this.mongoUrl = 'mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.url;
    } else {
        this.mongoUrl = 'mongodb://' + config.mongo.url;
    }
    this.db = null;
};

MongoConnection.prototype.get = function () {
    var p;
    if (connection.db) {
        logger.info('Mongo connection exists, returning connection');
        p = Promise.resolve(connection.db);
    } else {
        logger.info('Mongo connection DOES NOT exists, attempting to connect');
        p = _connect();
    }
    return p;
};

/**
 * Attempt to connect to the mongodb, and save the connection if successful.
 */
var _connect = function () {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(connection.mongoUrl, function(err, db) {
            if(err) {
                logger.error('Failed to connect to Mongo.');
                connection.db = null;
                reject(err);
                return;
            }

            logger.info('Successfully connected to Mongo.');
            connection.db = db;
            resolve(db);
        });
    });
};

var connection = new MongoConnection();

module.exports = connection;