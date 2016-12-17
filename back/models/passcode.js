var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passcodeSchema = new Schema({
	passcode: {type: String, required: true},
	token: {type: String}
});

module.exports = mongoose.model('Passcodes', passcodeSchema);