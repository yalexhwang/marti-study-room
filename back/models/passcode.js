var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passcodeSchema = new Schema({
	user: {type: String, required: true},
	passcode: {type: String, required: true},
	token: {type: String}
});

module.exports = mongoose.model('Passcodes', passcodeSchema);