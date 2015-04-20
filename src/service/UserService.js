var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    properties = require('../../resources/properties.json'),
    bcrypt = require('bcrypt');

var UserService = function() {
    this.mongoUrl = 'mongodb://' + properties.mongo.username + ':' + properties.mongo.password + '@' + properties.mongo.url;
    console.log('UserService attempting to connect to ' + this.mongoUrl);
    var service = this;
    MongoClient.connect(this.mongoUrl, function(err, db) {
        if(err) {
            throw err;
        }

        console.log('UserService successfully connected.');
        service.db = db;
        service.userCollection = db.collection('users');
    });
};

UserService.prototype.createUser = function(user) {
    var service = this;
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) reject(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err){
                    reject(err);
                    return;
                }
                user.password = hash;

                service.userCollection.insert(user, function(err, result) {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
        });
    });
};

UserService.prototype.read = function(id) {
    var service = this;
    return new Promise(function(resolve, reject) {
        var objectId = new ObjectID(id);
        service.userCollection.findOne({"_id": objectId}, function(err, result) {
            if(err){
                reject(err);
                return;
            }

            resolve(cleanResult(result));
        });
    });
};

UserService.prototype.readByEmail = function(email) {
    var service = this;
    return new Promise(function(resolve, reject) {
        service.userCollection.findOne({"email": email}, function(err, result) {
            if(err){
                reject(err);
                return;
            }

            resolve(cleanResult(result));
        });
    })
};

UserService.prototype.readByUsername = function(username) {
    var service = this;
    return new Promise(function(resolve, reject) {
        service.userCollection.findOne({"username": username}, function(err, result) {
            if(err){
                reject(err);
                return;
            }

            resolve(cleanResult(result));
        });
    })
};

UserService.prototype.checkPassword = function(emailOrUsername, testPassword) {
    var service = this;
    var query = {
        $or:[
            {"username":emailOrUsername},
            {"email":emailOrUsername}
        ]
    };
    return new Promise(function(resolve, reject) {
        service.userCollection.findOne(query, function(err, user) {
            if(err){
                reject(err);
                return;
            }

            if (!user) {
                console.log('no user found!');
                resolve({match: false});
                return;
            }

            bcrypt.compare(testPassword, user.password, function(err, result) {
                if(err){
                    reject(err);
                    return;
                }
                resolve({match: result, user: cleanResult(user)});
            })
        });
    });
};

function cleanResult(user) {
    if (!user) return user;
    user._id = user._id.toHexString();
    delete user.password;
    return user;
}

module.exports = new UserService();