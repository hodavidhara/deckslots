function *unauthorized(next){
    if (this.isAuthenticated()) {
        yield next;
    } else {
        this.status = 401;
        yield this.render('401');
    }
}

module.exports = unauthorized;