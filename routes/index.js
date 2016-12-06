var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/marti';
var Word = require('../models/word');
mongoose.connect(mongoUrl);

router.post('/add', function(req, res, next) {
	console.log('/add');
	var lng = req.body.lng;
	var word = req.body.word;
	var part = Number(req.body.part);
	var def = req.body.def;

	var newWord = new Word({
		language: lng,
		part: part,
		word: word,
		definition: def
	});
	console.log(newWord);
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
});

router.post('/get_full_list', function(req, res, next) {
	console.log('/get_full_list');
	Word.find({}, function(err, docs) {
		if (err) {
			console.log('line 45: error in getting the full list');
			console.log(err);
			res.json({
				passFail: 0,
				doc: err
			})
		} else {
			console.log(docs);
			res.json({
				passFail: 1,
				doc: docs
			});
		}
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
