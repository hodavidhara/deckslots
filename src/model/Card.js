"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
    id: String,
    name: String,
    type: String,
    faction: String,
    rarity: String,
    cost: Number,
    attack: Number,
    health: Number,
    text: String,
    flavor: String,
    artist: String,
    collectible: Boolean,
    howToGetGold: String,
    mechanics: [String],
    setName: String
});

module.exports = mongoose.model('Card', CardSchema);