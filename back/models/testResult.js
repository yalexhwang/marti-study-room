var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testResultSchema = new Schema({
	user_id: {type: String, required: true},
	score: {
		percentile: {type: Number, required: true},
		correctAnswers: {type: Number, required: true},
		totalQuestions: {type: Number, required: true}
	},
	specified: {type: Number},
	multipleChoices: {type: Number, required: true},
	timed: {type: Object}
}, {timestamps: true});

module.exports = mongoose.model('TestResults', testResultSchema);
