function *unauthorized(next){
    if (this.isAuthenticated()) {
        console.log('authenticated!');
        yield next;
    } else {
        console.log('not authenticated!');
        this.status = 401;
        yield this.render('401');
    }
}

module.exports = unauthorized;