var martiApp = angular.module('martiApp', ['ngRoute', 'ngCookies']);
var url = "http://www.yalexhwang.com:3000";
// var url = "http://localhost:3000";

martiApp.run(function($rootScope, $http, $cookies, $location) {
	$rootScope.$on('$locationChangeStart', function(event, next, current) {
		console.log('rootScope.signedIn: ' + $rootScope.signedIn);
		var user = $cookies.getObject('user');
		if (user !== undefined) {
			$http.post(url + '/verify', user)
			.then(function success(rspns) {
				if (rspns.data.passFail === 1) {
					$rootScope.signedIn = 1;
				} else {
					console.log(rspns.data.doc);
					$rootScope.signedIn = 0;
				}
			}, function fail(rspns) {
				console.log(rspns);
				$rootScope.signedIn = 0;
			});
		} else {
			$rootScope.signedIn = 0;
		}
	});
});

//Router setting
martiApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'homeCtrl',
		templateUrl: 'templates/home.html'
	})
	.when('/quiz', {
		controller: 'quizCtrl',
		templateUrl: 'templates/quiz.html'
	})
	.when('/wordbank', {
		controller: 'wordbankCtrl',
		templateUrl: 'templates/wordbank.html'
	})
	.when('/signin', {
		controller: 'signinCtrl',
		templateUrl: 'templates/signin.html'
	})
	.when('/mypage', {
		controller: 'mypageCtrl',
		templateUrl: 'templates/mypage.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

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

	this.remove = function(id) {
		var def = $q.defer();
		$http.post(url + '/remove', id)
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

	this.updateWordRecord = function(list) {
		var def = $q.defer();
		var ajaxList = [];
		list.map(function(word) {
			ajaxList.push($http.post(url + '/update_record', word));
		})
		$q.all(ajaxList)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};
});

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

function createFullList(data, convertPartName, convertLngName) {
	var arr = [];
	for (var i = 0; i < data.length; i++) {
		//Create the full list, convert if necessary
		var word = data[i];
		word.partName = convertPartName(word.part);
		word.language = convertLngName(word.language);
		word.rootIndex = i + 1;
		arr.push(word);
	}
	return arr;
}

function createCurrentList(fullList, categoryNum) {
	var arr = [];
	var index = 1;
	for (var i = 0; i < fullList.length; i++) {
		if (categoryNum === "All") {
			var word = fullList[i];
			word.index = word.rootIndex;
			arr.push(word);
		} else if (fullList[i].part == categoryNum) {
			var word = fullList[i];
			word.index = index;
			arr.push(word);
			index++;
		}
	}
	return arr;
}

function createSortedList(sortedList) {
	var index = 1;
	for (var i = 0; i < sortedList.length; i++) {
		sortedList[i].index = index;
		index++;
	}
	return sortedList;
}

function calculatePageView(totalNumOfWords, numPerPage) {
	var lastpage;
	if (numPerPage == 0) {
		lastPage = 1;
	}
	if (totalNumOfWords < numPerPage) {
		lastPage = 1;
	} else {
		lastPage = Math.ceil(totalNumOfWords / numPerPage);
	} 
	var pageArr = [];
	for (var i = 1; i <= lastPage; i++) {
		pageArr.push(i);
	}
	return pageArr;
}

function createPageList(currentList, currentPage, numPerPage) {
	var arr = currentList.slice(numPerPage * (currentPage - 1), numPerPage * currentPage);
	return arr;
}

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function sortByWordAscending(a, b) {
	if (a.word < b.word) {
		return -1;
	} else if (a.word > b.word) {
		return 1;
	} else {
		return 0;
	}
}

function sortByWordDescending(a, b) {
	if (a.word < b.word) {
		return 1;
	} else if (a.word > b.word) {
		return -1;
	} else {
		return 0;
	}
}

function sortByPartAscending(a, b) {
	if (a.partName < b.partName) {
		return -1;
	} else if (a.partName > b.partName) {
		return 1;
	} else {
		return 0;
	}
}

function sortByPartDescending(a, b) {
	if (a.partName < b.partName) {
		return 1;
	} else if (a.partName > b.partName) {
		return -1;
	} else {
		return 0;
	}
}

function sortByTimeAscending(a, b) {
	if (a.rootIndex < b.rootIndex) {
		return -1;
	} else if (a.rootIndex > b.rootIndex) {
		return 1;
	} else {
		return 0;
	}
}

function sortByTimeDescending(a, b) {
	if (a.rootIndex < b.rootIndex) {
		return 1;
	} else if (a.rootIndex > b.rootIndex) {
		return -1;
	} else {
		return 0;
	}
}

function updateWordRecord(arr, result) {
	var newArr = [];
	var word;
	for (var i = 0; i < arr.length; i++) {
		if (result) {
			word = {
				_id: arr[i]._id,
				record: arr[i].record + 1
			};
		} else {
			word = {
				_id: arr[i]._id,
				record: arr[i].record - 1
			};
		}
		newArr.push(word);
	}
	return newArr;
}

