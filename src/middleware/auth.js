var passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserService = require('../service/UserService');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    UserService.read(id).then(function (user) {
        done(null, user);
    }, function(err) {
        done(err);
    })
});

passport.use(new LocalStrategy(function(username, password, done) {
    UserService.checkPassword(username, password).then(function(result) {
        if(result.match) {
            return done(null, result.user);
        } else {
            return done(null, false, { message: 'Invalid password' });
        }
    }, function(err) {
        return done(err);
    })
}));

module.exports = passport;