var _ = require('lodash');
var JSON_MIMETYPE = 'application/json';

function api(mw) {
    return function *(next){
        if (_.includes(this.accepts(), JSON_MIMETYPE)) {
            yield mw.call(this, next);
        } else {
            yield next;
        }
    }
}

module.exports = api;