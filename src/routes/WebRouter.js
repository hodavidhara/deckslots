var router = require('koa-router');
var body = require('koa-body')();

var web = require('../middleware/web');
var secure = require('../middleware/secure');
var passport = require('../middleware/auth');

var DeckService = require('../service/DeckService');
var UserService = require('../service/UserService');

var webRouter = router();

webRouter.get('/', function *() {
    yield this.render('index');
});

webRouter.get('/register', function *() {
    yield this.render('register');
});

webRouter.post('/register', body, function *() {
    var user = {};
    user.username = this.request.body.username;
    user.email = this.request.body.email;
    user.password = this.request.body.password;
    yield UserService.createUser(user);
    // TODO: automatically authenticate user;
    this.redirect('/');
});

webRouter.get('/login', function *() {
    yield this.render('login');
});

webRouter.post('/login', body, passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login'
}));

webRouter.get('/account', secure, function *() {
    var user = this.req.user;
    var decks = yield DeckService.getDecksForUser(user);
    yield this.render('account', {
        decks: decks,
        user: user
    });
});

webRouter.get('/deckbuilder', secure, body, function *() {
    yield this.render('deckbuilder');
});

webRouter.get('/deck/:id', function *() {
    var deck = yield DeckService.readDeck(this.params.id);
    var user = yield UserService.read(deck.user);
    yield this.render('deck', {
        deck: deck,
        user: user
    });
});

module.exports = webRouter;