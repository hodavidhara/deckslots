// Koa and koa middleware
var koa = require('koa');
var handlebars = require('koa-handlebars');
var session = require('koa-session');
var serve = require('koa-static');
var logger = require('./src/logger');

// Routes
var routes = require('./src/routes');

// Custom middleware.
var pageNotFound = require('./src/middleware/404');
var passport = require('./src/middleware/auth');

var app = koa();

// Register handlebars
app.use(handlebars({
    layoutsDir: 'templates/layouts',
    viewsDir: 'templates/views',
    partialsDir: 'templates/partials',
    defaultLayout: 'main',
    cache: app.env !== "development",
    data: {
        dev: app.env === "development"
    }
}));

// Register session
app.keys = ['secret'];
app.use(session(app));

// Register passport
app.use(passport.initialize());
app.use(passport.session());

// Register static files.
app.use(serve('static'));

// Register Router
// Router registration must go after passport initialization.
routes(app);

// set up 404 middleware.
app.use(pageNotFound);

app.listen(3000);
logger.info('listening on port 3000');