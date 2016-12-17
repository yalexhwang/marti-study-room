var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wordSchema = new Schema({
	language: {type: String, required: true},
	part: {type: Number, required: true},
	record: {
		correct: {type: Number},
		incorrect: {type: Number}
	}, 
	word: {type: String, required: true},
	definition: {type: String, required: true}
});

module.exports = mongoose.model('Words', wordSchema);