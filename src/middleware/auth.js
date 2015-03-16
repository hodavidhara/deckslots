var passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserService = require('../UserService');

passport.serializeUser(function(user, done) {
    console.log('serialize user!');
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log('deserialize user');
    console.log(id);
    UserService.read(id).then(function (user) {
        done(null, user);
    }, function(err) {
        done(err);
    })
});

passport.use(new LocalStrategy(function(username, password, done) {
    console.log('LOCAL STRATEGY');

    UserService.checkPassword(username, password).then(function(result) {
        console.log(result);
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