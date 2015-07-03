var MongoCollection = require('./MongoCollection'),
    ObjectID = require('mongodb').ObjectID,
    properties = require('../../resources/properties.json'),
    bcrypt = require('bcrypt');

var UserService = function() {
    this.userCollection = new MongoCollection('users');
};

UserService.prototype.createUser = function(user) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                reject(err);
                return;
            }

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err){
                    reject(err);
                    return;
                }
                user.password = hash;

                service.userCollection.get().then(function (collection) {
                    collection.insert(user, function(err, result) {
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                });
            });
        });
    });
};

UserService.prototype.read = function(id) {
    return new Promise(function(resolve, reject) {
        var objectId = new ObjectID(id);
        service.userCollection.get().then(function (collection) {
            collection.findOne({"_id": objectId}, function(err, result) {
                if(err){
                    reject(err);
                    return;
                }

                resolve(cleanResult(result));
            });
        });
    });
};

UserService.prototype.readByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        service.userCollection.get().then(function (collection) {
            collection.findOne({"email": email}, function(err, result) {
                if(err){
                    reject(err);
                    return;
                }

                resolve(cleanResult(result));
            });
        });
    })
};

UserService.prototype.readByUsername = function(username) {
    return new Promise(function(resolve, reject) {
        service.userCollection.get().then(function (collection) {
            collection.findOne({"username": username}, function(err, result) {
                if(err){
                    reject(err);
                    return;
                }

                resolve(cleanResult(result));
            });
        });
    })
};

UserService.prototype.checkPassword = function(emailOrUsername, testPassword) {
    var query = {
        $or:[
            {"username":emailOrUsername},
            {"email":emailOrUsername}
        ]
    };

    return new Promise(function(resolve, reject) {
        service.userCollection.get().then(function (collection) {
            collection.findOne(query, function(err, user) {
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
    });
};

function cleanResult(user) {
    if (!user) return user;
    user._id = user._id.toHexString();
    delete user.password;
    return user;
}

var service = new UserService();

module.exports = service;