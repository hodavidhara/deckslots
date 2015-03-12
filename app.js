var koa = require('koa');
var handlebars = require('koa-handlebars');

var app = koa();

// Register handlebars
app.use(handlebars({
    layoutsDir: 'templates/layouts',
    viewsDir: 'templates/views',
    partialsDir: 'templates/partials',
    defaultLayout: 'main'
}));

app.use(function *() {
    yield this.render('index', {
        text: 'Hello, World!'
    });
});

app.listen(3000);