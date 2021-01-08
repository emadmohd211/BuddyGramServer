const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const contact = new Schema({
   _id: mongoose.Schema.Types.ObjectId,
   user_id: String,
   contact:[{
		firstName: String,
		lastName: String,
		contactNumber: String,
   }]
});

module.exports = mongoose.model('Contact', contact);