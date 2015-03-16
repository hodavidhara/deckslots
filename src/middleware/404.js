function *pageNotFound(next){
    yield next;

    if (404 != this.status) {
        return;
    }

    // we need to explicitly set 404 here
    // so that koa doesn't assign 200 on body=
    this.status = 404;
    yield this.render('404');
}

module.exports = pageNotFound;