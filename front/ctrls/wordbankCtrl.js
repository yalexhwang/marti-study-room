martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, WordBankService) {
	//Initial Setting - forms
	$scope.showFormNotif = 0;
	$scope.showKOR = 1;
	$scope.formTitle = "Add Korean";
	$scope.switchLng = "English";

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

	//Adding Korean
	$scope.KOR = {};
	$scope.addKOR = function() {
		var duplicate = 0;
		for (var i = 0; i < $rootScope.fullList.length; i++) {
			if ($scope.KOR.word == $rootScope.fullList[i].word) {
				duplicate = 1;
			}
		}
		if (duplicate) {
			$scope.failMessage = "The word you entered is already in Word Bank.";
			$scope.showFormNotif = 1;
			$scope.showFail = 1;
			$scope.showSuccess = 0;
		} else {
			console.log($scope.KOR);
			$scope.KOR.language = 'k';
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
						$scope.failMessage = "Oops, Someting wentwrong. Please try again.";
					$scope.showFormNotif = 1;
					$scope.showFail = 1;
					$scope.showSuccess = 0;
				}
			}, function fail(rspns) {
				console.log(rspns);
			});
		}
	};

	//Adding English 
	// $scope.ENG = {};
	// $scope.addENG = function() {
	// 	$scope.ENG.language = 'e';
	// 	console.log($scope.ENG);
	// 	WordBankService.add($scope.ENG)
	// 	.then(function success(rspns) {
	// 		console.log(rspns);
	// 		if (rspns.data.passFail) {
	// 			$scope.showFormNotif = 1;
	// 			$scope.showSuccess = 1;
	// 			$scope.showFail = 0;
	// 			$scope.addedWord = rspns.data.doc;
	// 			$scope.ENG = {};
	// 		} else {
	// 			$scope.showFormNotif = 1;
	// 			$scope.showFail = 1;
	// 			$scope.showSuccess = 0;
	// 		}
	// 	}, function fail(rspns) {
	// 		console.log(rspns);
	// 	});
	// };

	$scope.updateFullList = function() {
		$rootScope.fullList = [];
		WordBankService.getFullList()
		.then(function success(rspns) {
			$rootScope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
			$scope.currentPage = Math.ceil($rootScope.fullList.length / $scope.wordCount); 
			$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
			$scope.pages = calculatePageView($rootScope.fullList.length, $scope.wordCount);
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	//Default Setting for Word List
	$rootScope.fullList = [];
	$scope.subList = [];
	$scope.currentList = [];
	$scope.currentPage = 1;
	$scope.wordCount = 10;
	// $scope.pages = [];

	WordBankService.getFullList()
	.then(function success(rspns) {
		console.log(rspns);
		//Create the full list
		$rootScope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
		//Create the current list
		$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
		//Create the page array
		$scope.pages = calculatePageView($rootScope.fullList.length, $scope.wordCount);
	}, function fail(rspns) {
		console.log(rspns);
	});

	//Update Words Per Page View
	$scope.updateNumPerPage = function() {
		console.log($scope.wordCount);
		//Create the current list
		$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
		//Create the page array
		$scope.pages = calculatePageView($rootScope.fullList.length, $scope.wordCount);
		console.log($scope.currentList);
		console.log($scope.pages);
	};

	//Update part category
	$scope.updatePartCategory = function() {
		console.log($scope.partCategory);
		if ($scope.partCategory === "all") {
			$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
			$scope.pages = calculatePageView($rootScope.fullList.length, $scope.wordCount);
		} else {
			for (var i = 0; i < $rootScope.fullList.lenght; i++) {
				var index = 1;
				if ($rootScope.fullList[i].part == convertPartName(Number($scope.partCategory))) {
					$rootScope.fullList[i].index = index;
					$scope.subList.push($rootScope.fullList[i]);
					index++;
				}
			}
			$scope.currentList = createCurrentList($scope.subList, $scope.currentPage, $scope.wordCount);
			$scope.pages = calculatePageView($scope.subList.length, $scope.wordCount);
		}
	};

	//Change page
	$scope.previousPage = function() {
		if ($scope.currentPage > 1) {
			$scope.currentPage--;
			console.log('currentPage: ' + $scope.currentPage);
			$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
		}

	}
	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pages.length) {
			$scope.currentPage++;
			console.log('currentPage: ' + $scope.currentPage);
			$scope.currentList = createCurrentList($rootScope.fullList, $scope.currentPage, $scope.wordCount);
		}
	};
	$scope.goToPage = function(page) {
		console.log(page);
		$scope.currentList = createCurrentList($rootScope.fullList, page, $scope.wordCount);
	}

});