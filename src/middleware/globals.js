function *globals(next){

    this.state = this.state || {};
    this.state.authenticated = this.isAuthenticated();

    yield next;
}

module.exports = globals;