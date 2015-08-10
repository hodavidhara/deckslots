var User = require('../model/User'),
    bcrypt = require('bcrypt'),
    logger = require('../logger');

var UserService = function() {};

UserService.prototype.createUser = function(user) {
    return new Promise(function(resolve, reject) {
        console.log('generating salt');
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
                new User(user).save(function (err, user) {
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    }
                    console.log(user);
                    resolve(user);
                });
            });
        });
    });
};

UserService.prototype.read = function(id) {
    return new Promise(function(resolve, reject) {
        User.findById(id, function (err, user) {
            if(err){
                reject(err);
                return;
            }

            resolve(cleanResult(user));
        });
    });
};

UserService.prototype.readByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        User.findOne({"email": email}, function (err, user) {
            if(err){
                reject(err);
                return;
            }

            resolve(cleanResult(user));
        });
    })
};

UserService.prototype.readByUsername = function(username) {
    return new Promise(function(resolve, reject) {
        User.findOne({"username": username}, function (err, user) {
            if(err){
                reject(err);
                return;
            }

            resolve(cleanResult(user));
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
        User.findOne(query, function (err, user) {
            if(err){
                reject(err);
                return;
            }

            if (!user) {
                logger.info('no user found for %s', emailOrUsername);
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

var service = new UserService();

module.exports = service;