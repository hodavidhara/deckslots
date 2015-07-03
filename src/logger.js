var winston = require('winston'),
    config = require('konfig')();

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            level: config.app.debugLevel,
            colorize: true
        })
    ]
});

module.exports = logger;