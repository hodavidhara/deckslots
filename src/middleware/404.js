function *pageNotFound(next){
    yield next;

    if (404 != this.status) {
        return;
    }

    // we need to explicitly set 404 here
    // so that koa doesn't assign 200 on body=
    this.status = 404;
    switch (this.accepts('html', 'json')) {
        case 'html':
            yield this.render('404');
            break;
        case 'json':
            this.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            this.type = 'text';
            this.body = 'Page Not Found';
    }
}

module.exports = pageNotFound;