var router = require('koa-router');
var body = require('koa-body')();

var api = require('../middleware/api');
var secure = require('../middleware/secure');

var CardService = require('../service/CardService');
var DeckService = require('../service/DeckService');

var apiRouter = router();

apiRouter.post('/deck', secure, body, function *() {
    var deck = this.request.body;
    deck.user = this.req.user._id;
    deck = yield DeckService.createDeck(deck);
    this.body = deck[0];
});

apiRouter.get('/deck/:deckId', function *() {
    var deck = yield DeckService.getLatestVersionOfDeck(this.params.deckId);
    this.body = JSON.stringify(deck);
});

apiRouter.post('/deck/:deckId', secure, body, function *() {
    var deck = this.request.body;
    deck.user = this.req.user._id;
    deck = yield DeckService.updateDeck(deck);
    this.body = deck[0];
});

apiRouter.get('/card', function *() {
    var cards = yield CardService.getCollectibleCards();
    this.body = JSON.stringify(cards);
});

module.exports = apiRouter;