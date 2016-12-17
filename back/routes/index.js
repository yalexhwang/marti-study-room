var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/marti';
var Word = require('../models/word');
var Passcode = require('../models/passcode');
mongoose.connect(mongoUrl);

var randToken = require('rand-token');

router.post('/signin', function(req, res, next) {
	var passcode = req.body.passcode;
	Passcode.findOne({'passcode': passcode}, function(err, doc) {
		if (err) {
			console.log('error while matching the passcode ');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			});	
		} else {
			if (doc) {
				var token = randToken.generate(32);
				Passcode.findOneAndUpdate({'_id': doc._id}, {$set: {'token': token}}, {new: true}, function(err, doc) {
					if (err) {
						console.log('error updating the token info');
						console.log(err);
						res.json({
							passFail: 0,
							doc: err
						});
					} else {
						if (doc) {
							res.json({
								passFail: 1,
								doc: {
									id: doc._id,
									token: doc.token
								}
							});
						} else {
							res.json({
								passFail: 0,
								doc: doc
							});
						}
					}
				});
			} else {
				res.json({
					passFail: 0,
					doc: doc
				})
			}
		}
	});
});

router.post('/verify', function(req, res, next) {
	var user = req.body;
	Passcode.findOne({'_id': user.id}, function(err, doc) {
		if (err) {
			console.log('verification error in finding a matching ID');
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
						passFail: 0,
						doc: doc
					});
				}
			} else {
				res.json({
					passFail: 0,
					doc: doc
				});
			}
		}
	});
});

router.post('/signout', function(req, res, next) {
	console.log('/signout');
	Passcode.findOneAndUpdate({'token': req.body.token}, {$set: {'token': ""}}, {new: true}, function(err, doc) {
		if (err) {
			console.log('verification error in finding a matching token');
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
					passFail: 0,
					doc: doc
				});
			}
		}
	});
});

router.post('/add', function(req, res, next) {
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
			console.log('Error while finding a ducplicate match');
			console.log(err);
		} else {
			if (doc) {
				console.log(doc);
			} else {
				newWord.save(function(err, saved, status) {
					if (err) {
						console.log('line25: error in saving a new word');
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
	console.log(id);
	Word.remove({_id: id}, function(err) {
		if (err) {
			console.log('line 59: error in removing a word');
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
			console.log('line 45: error in getting the full list');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			})
		} else {
			console.log(doc);
			res.json({
				passFail: 1,
				doc: doc
			});
		}
	});
});


module.exports = router;
