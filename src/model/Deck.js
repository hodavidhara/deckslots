"use strict";
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId;

var DeckVersionSchema = new Schema({
    version: Number,
    comment: String,
    cards: [String]
});

var DeckSchema = new Schema({
    deckName: String,
    user: ObjectId,
    versions: [DeckVersionSchema]
});

DeckSchema.methods.version = function(versionNumber) {
    return _.find(this.version, {'version': versionNumber});
};

module.exports = mongoose.model('Deck', DeckSchema);


