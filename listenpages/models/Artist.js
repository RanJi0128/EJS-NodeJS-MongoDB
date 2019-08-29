var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ArtistSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    maximum_sale: {type: Number, default: 0},
    artist_name: {type: String, default: ""},
    // artist_info: {
    //     name: {type: String, default: ""},
    //     logo_url: {type: String, default: ""},
    //     maximum_sale: {type: Number, default: 0}
    // },
    // subscription_info: {
    //     plan: {type: String, default: ""},
    //     method: {type: String, default: ""}
    // },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artist', ArtistSchema);
ArtistSchema.plugin(uniqueValidator);