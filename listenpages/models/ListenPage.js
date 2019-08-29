var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    country: String,
    continent_code: String,
    enteredTime: String,
    referrer: String,
    goOutTime: Number,
    ipAddr: { type: String, default: '' },
    guid: { type: String, default: '' }
});

var ListenPageSchema = new mongoose.Schema({
    name: String,
    short_id: String,
    embeded_url: String,
    history: [ historySchema ],
    content_type: Number,
    max_event_time: String,
    user_id: String,
    text_header: String,
    text_body: String,
    button_text: String,
    button_link: String,
    sale_amount: Number,
    maximum_sale: Number,
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ListenPage', ListenPageSchema);

// content_type = {
//     "1": "audio",
//     "2": "video",
//     "3": "text",
//     "4": "button"
// }