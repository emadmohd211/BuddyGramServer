const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = new Schema({
   _id: mongoose.Schema.Types.ObjectId,
   user_id: String,
   connection:[{
		user_id: String,
	   contactNumber: String,
	   image: String
   }]
});

module.exports = mongoose.model('Connection', connection);