function *serverError(next){
    try {
        yield next;
    } catch (err) {

        this.status = err.status || 500;
        switch (this.accepts('html', 'json')) {
            case 'html':
                yield this.render('500');
                break;
            case 'json':
                this.body = {
                    error: err.message
                };
                break;
            default:
                this.type = 'text';
                this.body = 'Page Not Found';
        }
        this.app.emit('error', err, this);
    }
}

module.exports = serverError;