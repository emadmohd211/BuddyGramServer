const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const chatroom = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    eventid: string,
    message: string,

    members: [{
        user_id: String
    }]
});

module.exports = mongoose.model('Chatroom', chatroom);