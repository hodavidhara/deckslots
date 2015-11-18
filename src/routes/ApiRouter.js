var router = require('koa-router');
var body = require('koa-body')();

var api = require('../middleware/api');
var secure = require('../middleware/secure');

var CardService = require('../service/CardService');
var DeckService = require('../service/DeckService');
var UserService = require('../service/UserService');
var CardLoader = require('../service/CardLoader');

var apiRouter = router();

// Create a brand new deck
apiRouter.post('/deck', secure, body, function *() {
    var deck = this.request.body;
    deck.user = this.req.user._id;
    deck = yield DeckService.createDeck(deck);
    this.body = deck;
});

// Get a deck and all versions.
apiRouter.get('/deck/:id', function *() {
    var deck = yield DeckService.readDeck(this.params.id);
    deck.user = yield UserService.read(deck.user);
    this.body = JSON.stringify(deck);
});

// Update a deck, or create a deck with a specific id.
apiRouter.post('/deck/:id', secure, body, function *() {
    var deck = this.request.body;
    deck.user = this.req.user._id;
    deck = yield DeckService.updateDeck(deck);
    this.body = deck;
});

// Get a single deck version.
apiRouter.get('/deck/:id/v/:version', function *() {
    var deck = yield DeckService.readDeck(this.params.id);
    this.body = JSON.stringify(deck.version(this.params.version));
});

// Add a new version to a deck
apiRouter.post('/deck/:id/v', secure, body, function *() {
    var deck = yield DeckService.addVersion(this.params.id, this.request.body);
    this.body = deck;
});

apiRouter.get('/card', function *() {
    var cards = yield CardService.getCollectibleCards();
    this.body = JSON.stringify(cards);
});

apiRouter.post('/admin/loadcards', function *() {
    var cards = yield CardLoader.load();
    this.body = JSON.stringify(cards);
});
module.exports = apiRouter;