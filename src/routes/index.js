var api = require('../middleware/api');
var web = require('../middleware/web');

var ApiRouter = require('./ApiRouter');
var WebRouter = require('./WebRouter');

module.exports = function (app) {

    app.use(api(ApiRouter.routes()));
    app.use(api(ApiRouter.allowedMethods()));

    app.use(web(WebRouter.routes()));
    app.use(web(WebRouter.allowedMethods()));
};