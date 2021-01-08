const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const event_ = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: String,
    ownerName: String,
    title: String,
    venue: String,
    dateTime: Date,
    members: [{
        user_id: String,
        status: Number
    }]
});

module.exports = mongoose.model('Event_', event_);