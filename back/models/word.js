var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wordSchema = new Schema({
	language: {type: String, required: true},
	part: {type: Number, required: true},
	word: {type: String, required: true},
	definition: {type: String, required: true},
	record: {type: Number, default: 0}
});

module.exports = mongoose.model('Words', wordSchema);
