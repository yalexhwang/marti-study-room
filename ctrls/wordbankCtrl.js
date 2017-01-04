martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, $location, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}

	//Default Setting for Word List
	$scope.currentPage = 1;
	$scope.wordCount = 10;
	//Same fullList from homeCtrl
	console.log($scope.fullList);
	//Create the curret page list
	$scope.currentList = createCurrentList($scope.fullList, 'All');
	console.log($scope.currentList);
	//Create the curret page list
	$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
	console.log($scope.pageList);
		//Create the page array
	$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);

	//Default Setting for the form
	$scope.showFormNotif = 0;
	$scope.showKOR = 1;
	$scope.formTitle = "Add Korean";
	$scope.switchLng = "English";
	$scope.sortOption = "A-Z";

	//Adding Korean
	$scope.KOR = {};
	$scope.addKOR = function() {
		var duplicate = 0;
		for (var i = 0; i < $scope.fullList.length; i++) {
			if ($scope.KOR.word == $scope.fullList[i].word) {
				duplicate = 1;
			}
		}
		if (duplicate) {
			$scope.failMessage = "The word you entered is already in Word Bank.";
			$scope.showFormNotif = 1;
			$scope.showFail = 1;
			$scope.showSuccess = 0;
		} else {
			$scope.KOR.language = 'k';
			WordBankService.add($scope.KOR)
			.then(function success(rspns) {
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
		WordBankService.getFullList()
		.then(function success(rspns) {
			$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
			$scope.currentList = createCurrentList($scope.fullList, 'All');
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
			$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	//Update Words Per Page View
	$scope.updateNumPerPage = function() {
		var lastPage = Math.ceil($scope.currentList.length / $scope.wordCount);
		if ($scope.currentPage > lastPage) {
			$scope.currentPage = lastPage;
		}
		$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);
	};

	//Update part category
	$scope.updatePartCategory = function() {
		$scope.currentList = createCurrentList($scope.fullList, $scope.partCategory);
		$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);
	};

	//Sort
	$scope.sort = function() {
		if ($scope.sortOption === "A-Z") {
			$scope.sortOption = "Z-A";
			$scope.currentList = createSortedList($scope.currentList.sort(sortAscending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		} else if ($scope.sortOption === "Z-A") {
			$scope.sortOption = "A-Z";
			$scope.currentList = createSortedList($scope.currentList.sort(sortDescending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		}
	};

	//Remove a word
	$scope.removeWord = function(index) {
		var id = {id: $scope.pageList[index]._id};
		var rootIndex = $scope.pageList[index].rootIndex;
		WordBankService.remove(id)
		.then(function success(rspns) {
			WordBankService.getFullList()
			.then(function success(rspns) {
				$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
				$scope.currentList = createCurrentList($scope.fullList, 'All');
				$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
				$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);
			}, function fail(rspns) {
				console.log(rspns);
			});
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	//Change page
	$scope.previousPage = function() {
		if ($scope.currentPage > 1) {
			$scope.currentPage--;
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		}
	};
	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pages.length) {
			$scope.currentPage++;
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		}
	};
	$scope.goToPage = function(page) {
		$scope.currentPage = page;
		$scope.pageList = createPageList($scope.currentList, page, $scope.wordCount);
	};

});