var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/marti';
var Word = require('../models/word');
var Passcode = require('../models/passcode');
var TestResult = require('../models/testResult');
mongoose.connect(mongoUrl);

var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');

// -------------------------------------------
// passFail 0: error (doc: err)
// passFail 1: success (doc: doc)
// passFail 2: success with error (doc: 'String')
// -------------------------------------------

router.get('/test', function(req, res, next) {
	console.log('-----------------');
	var user = req.query.user;
	var pw = req.query.pw;
	console.log(req.query);
	var newPasscode = new Passcode({
		user: user,
		passcode: bcrypt.hashSync(pw)
	});
	console.log(newPasscode);
	newPasscode.save(function(err, saved, status) {
		if (err) {
			res.json(err);
		} else {
			res.json(saved);
		}
	});
});

router.post('/signin', function(req, res, next) {
	var user = req.body.user;
	var passcode = req.body.passcode;
	console.log(user);
	console.log(passcode);
	Passcode.findOne({'user': user}, function(err, doc) {
		if (err) {
			console.log('error while finding the user match');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});	
		} else {
			console.log('no error!');
			if (doc) {
				var match = bcrypt.compareSync(passcode, doc.passcode);
				console.log('match: ' + match);
				if (match) {
					var token = randToken.generate(32);
					console.log('token: ' + token);
					Passcode.findOneAndUpdate({'_id': doc._id}, {$set: {'token': token}}, {new: true}, function(err, doc) {
						if (err) {
							console.log('error updating the token info');
							console.log(err);
							res.json({
								passFail: 0,
								doc: err
							});
						} else {
							res.json({
								passFail: 1,
								doc: doc
							});
						}
					});
				} else {
					res.json({
						passFail: 2,
						doc: 'Error: passcode did not match'
					});
				}
			} else {
				console.log('no user found');
				res.json({
					passFail: 2,
					doc: 'Error: no user found'
				});
			}
		}
	});
});

router.post('/verify', function(req, res, next) {
	console.log('/verify');
	var user = req.body;
	console.log(user);
	Passcode.findOne({'_id': user._id}, function(err, doc) {
		if (err) {
			console.log('Error while running the query');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});
		} else {
			if (doc) {
				if (doc.token === user.token) {
					res.json({
						passFail: 1,
						doc: {
							id: doc._id,
							token: doc.token
						}
					});
				} else {
					res.json({
						passFail: 2,
						doc: "Error: token did not match, verification failed"
					});
				}
			} else {
				res.json({
					passFail: 2,
					doc: "Error: failed to find the user"
				});
			}
		}
	});
});

router.post('/signout', function(req, res, next) {
	console.log('/signout');
	Passcode.findOneAndUpdate({'token': req.body.token}, {$set: {'token': ""}}, {new: true}, function(err, doc) {
		if (err) {
			console.log('Error while running the query');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});
		} else {
			if (doc) {
				res.json({
					passFail: 1,
					doc: doc
				});
			} else {
				res.json({
					passFail: 2,
					doc: 'Error: Could not find the matching token.'
				});
			}
		}
	});
});

router.post('/add', function(req, res, next) {
	console.log(req.body);
	var lng = req.body.language;
	var word = req.body.word;
	var part = Number(req.body.part);
	var def = req.body.definition;
	var newWord = new Word({
		language: lng,
		part: part,
		word: word,
		definition: def
	});
	console.log(newWord);
	Word.findOne({'word': newWord.word}, function(err, doc) {
		if (err) {
			console.log('Error while finding a duplicate');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});
		} else {
			if (doc) {
				console.log('Duplicate found!');
				console.log(doc);
				res.json({
					passFail: 2,
					doc: 'Error: duplicate found'
				});
			} else {
				newWord.save(function(err, saved, status) {
					if (err) {
						console.log('Error while saving the new word');
						console.log(err);
						res.json({
							passFail: 0,
							doc: err
						});
					} else {
						res.json({
							passFail: 1,
							doc: saved
						});
					}
				});
			}
		}
	});
});

router.post('/remove', function(req, res, next) {
	var id = req.body.id;
	console.log('id to remove: ' + id);
	Word.remove({_id: id}, function(err) {
		if (err) {
			console.log('Error while removing the word');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			})
		} else {
			res.json({
				passFail: 1
			});
		}
	});
});

router.post('/get_full_list', function(req, res, next) {
	Word.find({}, function(err, doc) {
		if (err) {
			console.log('Error while running the query');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			})
		} else {
			res.json({
				passFail: 1,
				doc: doc
			});
		}
	});
});

router.post('/update_record', function(req, res, next) {
	var word = req.body;
	console.log(word);
	Word.findOneAndUpdate({'_id': word._id}, {$set: {'record': word.record}}, {new: true}, function(err, doc) {
		if (err) {
			console.log('Error while updating the word record');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});
		} else {
			res.json({
				passFail: 1,
				doc: doc
			});
		}
	});
});

router.post('/update_test_result', function(req, res, next) {
	var newTestResult = new TestResult(req.body);
	console.log(newTestResult);
	newTestResult.save(function(err, saved, status) {
		if (err) {
			console.log('Error while saving the new test result');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});
		} else {
			res.json({
				passFail: 1,
				doc: saved
			});
		}
	})
});

router.post('/get_test_results', function(req, res, next) {
	console.log('get_test_results');
	var user = req.body;
	console.log(user);
	TestResult.find({'user_id': user._id}, function(err, doc) {
		if (err) {
			console.log("Error while finding the matching user");
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});
		} else {
			res.json({
				passFail: 1,
				doc: doc
			});
		}
	})
});

module.exports = router;
