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


//Controllers
martiApp.controller('martiCtrl', function($scope, $rootScope, WordBankService) {
	//Default Setting for Word List
	$rootScope.fullList = [];
	$scope.currentList = [];
	$scope.currentPage = 1;
	$scope.wordCount = 10;
	// $scope.pages = [];

	WordBankService.getFullList()
	.then(function success(rspns) {
		console.log(rspns);
		for (var i = 0; i < rspns.data.doc.length; i++) {
			//Create the full list, convert if necessary
			var word = rspns.data.doc[i];
			word.part = convertPartName(rspns.data.doc[i].part);
			word.language = convertLngName(rspns.data.doc[i].language);
			$rootScope.fullList.push(word);
		}
		//Create the current list
		$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
		//Create the page array
		$scope.pages = calculatePageView($rootScope.fullList.length, $scope.wordCount);
	}, function fail(rspns) {
		console.log(rspns);
	});

	//Update Words Per Page View
	$scope.updateNumPerPage = function(that) {
		$scope.wordCount = that.wordCount;
		console.log($scope.wordCount);
		//Create the current list
		$scope.currentList = createCurrentList($scope.fullList, $scope.currentPage, $scope.wordCount);
		//Create the page array
		$scope.pages = calculatePageView($scope.fullList.length, $scope.wordCount);
	};

	//Change page view
	$scope.previousPage = function() {
		if ($scope.currentPage > 1) {
			$scope.currentPage--;
			console.log('currentPage: ' + $scope.currentPage);
			$scope.currentList = createCurrentList($scope.fullList, $scope.currentPage, $scope.wordCount);
		}

	}
	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pages.length) {
			$scope.currentPage++;
			console.log('currentPage: ' + $scope.currentPage);
			$scope.currentList = createCurrentList($scope.fullList, $scope.currentPage, $scope.wordCount);
		}
	};
	$scope.goToPage = function(page) {
		console.log(page);
		$scope.currentList = createCurrentList($scope.fullList, page, $scope.wordCount);
	}

});

martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, WordBankService) {
	//Initial Setting - forms
	$scope.showFormNotif = 0;
	$scope.showKOR = 1;
	$scope.formTitle = "Add Korean";
	$scope.switchLng = "English";
	//Initial Setting - full list
	$scope.fullListOn = 0;
	$scope.fullListBtn = "Show Full List";

	//Change the form between KOR and ENG
	$scope.toggleForm = function() {
		//Currently unavailable
		$window.alert('Coming Soon');
		// if ($scope.showKOR) {
		// 	$scope.showKOR = 0;
		// 	$scope.formTitle = "Add English"
		// 	$scope.switchLng = "Korean";
		// } else {
		// 	$scope.showKOR = 1;
		// 	$scope.formTitle = "Add Korean";
		// 	$scope.switchLng = "English";
		// }
	};

	// 벗다
	// 사다
	// 팔다
	// 보다

	//Adding Korean
	$scope.KOR = {};
	$scope.addKOR = function() {
		$scope.KOR.language = 'k';
		console.log($scope.KOR);
		WordBankService.add($scope.KOR)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail) {
				$scope.showFormNotif = 1;
				$scope.showSuccess = 1;
				$scope.showFail = 0;
				$scope.addedWord = rspns.data.doc;
				$scope.KOR = {};
			} else {
				$scope.showFormNotif = 1;
				$scope.showFail = 1;
				$scope.showSuccess = 0;
			}
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	//Adding English 
	$scope.ENG = {};
	$scope.addENG = function() {
		$scope.ENG.language = 'e';
		console.log($scope.ENG);
		WordBankService.add($scope.ENG)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail) {
				$scope.showFormNotif = 1;
				$scope.showSuccess = 1;
				$scope.showFail = 0;
				$scope.addedWord = rspns.data.doc;
				$scope.ENG = {};
			} else {
				$scope.showFormNotif = 1;
				$scope.showFail = 1;
				$scope.showSuccess = 0;
			}
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	$scope.toggleFullList = function() {
		if ($scope.fullListOn) {
			$scope.fullListOn = 0;
			$scope.fullListBtn = "Show Full List";
		} else {
			$scope.fullListOn = 1;
			$scope.fullListBtn = "Hide Full List";
		}
	}

	$scope.showEdit = 0;
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




