var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passcodeSchema = new Schema({
	tests: {type: Array},
	passcode: {type: String, required: true},
	token: {type: String}
});

module.exports = mongoose.model('Passcodes', passcodeSchema);