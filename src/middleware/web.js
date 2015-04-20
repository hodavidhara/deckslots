var _ = require('lodash');
var HTML_MIMETYPE = 'text/html';

function web(mw) {
    return function *(next) {
        if (_.includes(this.accepts(), HTML_MIMETYPE)) {
            yield mw.call(this, next);
        } else {
            yield next;
        }
    }
}

module.exports = web;