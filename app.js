var koa = require('koa');
var handlebars = require('koa-handlebars');
var router = require('koa-router');

var app = koa();

// Register handlebars
app.use(handlebars({
    layoutsDir: 'templates/layouts',
    viewsDir: 'templates/views',
    partialsDir: 'templates/partials',
    defaultLayout: 'main'
}));

// Register router
app.use(router(app));

app.get('/', function *() {
    yield this.render('index', {
        text: 'Hello, World!'
    });
});

app.use(function *pageNotFound(next){
    yield next;

    if (404 != this.status) {
        return;
    }


    // we need to explicitly set 404 here
    // so that koa doesn't assign 200 on body=
    this.status = 404;
    yield this.render('404');
});

app.listen(3000);
console.log('listening on port 3000');