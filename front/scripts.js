var martiApp = angular.module('martiApp', ['ngRoute']);
var url = "http://localhost:3000";

//Reusable functions 
function convertPartName(num) {
	switch(num) {
		case 0:
			return "명사(noun)";
		case 1:
			return "대명사(pronoun)";
		case 2:
			return "동사(verb)";
		case 3:
			return "형용사(adjective)";
		case 4:
			return "부사(adverb)";
		case 5:
			return "전치사(proposition)";
		case 6:
			return "접속사(conjuction)";
		case 7:
			return "감탄사(interjection)";
		default: 
			return "N/A"
	}
}

function convertLngName(lng) {
	switch(lng) {
		case 'k':
			return 'KOR';
		case 'e':
			return 'ENG';
	}
}

function calculatePageView(totalNumOfWords, numPerPage) {
	var lastPage = Math.ceil(totalNumOfWords / numPerPage); 
	var pageArr = [];
	for (var i = 1; i <= lastPage; i++) {
		pageArr.push(i);
	}
	return pageArr;
}

function createCurrentList(fullList, currentPage, numPerPage) {
	var startingIndex = numPerPage * (currentPage - 1);
	var endingIndex = numPerPage * currentPage;
	return fullList.slice(startingIndex, endingIndex);
}

//Services
martiApp.service('WordBankService', function($http, $q) {
	this.add = function(newWord) {
		var def = $q.defer();
		$http.post(url + '/add', newWord)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};

	this.getFullList = function() {
		var def = $q.defer();
		$http.post(url + '/get_full_list')
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};
});

//Router setting
martiApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'martiCtrl',
		templateUrl: 'templates/home.html'
	})
	.when('/wordbank', {
		controller: 'wordbankCtrl',
		templateUrl: 'templates/wordbank.html'
	});
});




