var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    properties = require('../../resources/properties.json');

/**
 * Sets the appropriate connection url.
 *
 * @constructor
 */
var MongoConnection = function() {
    this.mongoUrl = "";
    if (properties.mongo.username) {
        this.mongoUrl = 'mongodb://' + properties.mongo.username + ':' + properties.mongo.password + '@' + properties.mongo.url;
    } else {
        this.mongoUrl = 'mongodb://' + properties.mongo.url;
    }
    this.db = null;
};

MongoConnection.prototype.get = function () {
    var p;
    if (connection.db) {
        console.log('Mongo connection exists, returning connection');
        p = Promise.resolve(connection.db);
    } else {
        console.log('Mongo connection DOES NOT exists, attempting to connect');
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
                console.log('Failed to connect to Mongo.');
                connection.db = null;
                reject(err);
                return;
            }

            console.log('Successfully connected to Mongo.');
            connection.db = db;
            resolve(db);
        });
    });
};

var connection = new MongoConnection();

module.exports = connection;