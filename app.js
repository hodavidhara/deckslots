// Koa and koa middleware
var koa = require('koa');
var handlebars = require('koa-handlebars');
var router = require('koa-router');
var body = require('koa-body')();
var session = require('koa-session');

var pageNotFound = require('./src/middleware/404');
var secure = require('./src/middleware/secure');
var passport = require('./src/middleware/auth');

// Custom services.
var UserService = require('./src/UserService');

var app = koa();

// Register handlebars
app.use(handlebars({
    layoutsDir: 'templates/layouts',
    viewsDir: 'templates/views',
    partialsDir: 'templates/partials',
    defaultLayout: 'main'
}));

// Register session
app.keys = ['secret'];
app.use(session(app));

// Register passport
app.use(passport.initialize());
app.use(passport.session());

// Register Router
// Router registration must go after passport initialization.
app.use(router(app));

app.get('/', function *() {
    yield this.render('index', {
        text: 'Hello, World!'
    });
});

app.get('/register', function *() {
    yield this.render('register');
});

app.post('/register', body, function *() {
    var user = {};
    user.username = this.request.body.username;
    user.email = this.request.body.email;
    user.password = this.request.body.password;
    yield UserService.createUser(user);
    // TODO: automatically authenticate user;
    this.redirect('/');
});

app.get('/login', function *() {
    yield this.render('login');
});

app.post('/login', body, passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login'
}));

app.get('/account', secure, function *() {
    console.log(this.req.user);
    yield this.render('account', {
        user: this.req.user
    });
});

// set up 404 middleware.
app.use(pageNotFound);

app.listen(3000);
console.log('listening on port 3000');