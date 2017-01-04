martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, $location, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}

	//Default Setting
	$scope.showNotif = 0;
	$scope.currentPage = 1;
	$scope.wordCount = 10;
	$scope.sortOption1 = "A-Z";
	$scope.sortOption2 = "Part";
	$scope.sortOption3 = "Time Added";

	//Create the curret page list using the same fullList
	$scope.currentList = createCurrentList($scope.fullList, 'All');
	//Create the curret page list
	$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		//Create the page array
	$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);

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
			$scope.notifMessage = $scope.KOR.word + " is already in Word Bank.";
			$scope.showNotif = 1;
			$scope.KOR = {};
		} else {
			$scope.KOR.language = 'k';
			WordBankService.add($scope.KOR)
			.then(function success(rspns) {
				if (rspns.data.passFail) {
					$scope.showNotif = 1;
					$scope.notifMessage = "Added!";
					$scope.showUpdateBtn = 1;
					$scope.KOR = {};
				} else {
					$scope.notifMessage = "Oops, Someting went wrong. Please try again.";
					$scope.showNotif = 1;
				}
			}, function fail(rspns) {
				console.log(rspns);
			});
		}
	};

	$scope.updateFullList = function() {
		WordBankService.getFullList()
		.then(function success(rspns) {
			$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
			$scope.currentList = createCurrentList($scope.fullList, 'All');
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
			$scope.pages = calculatePageView($scope.currentList.length, $scope.wordCount);
			$scope.showNotif = 0;
			$scope.showUpdateBtn = 0;
		}, function fail(rspns) {
			console.log(rspns);
			$scope.notifMessage = "Update failed, try again.";
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

	//SortOption1
	$scope.sortByWord = function() {
		if ($scope.sortOption1 === "A-Z") {
			$scope.sortOption1 = "Z-A";
			$scope.currentList = createSortedList($scope.currentList.sort(sortByWordAscending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		} else if ($scope.sortOption1 === "Z-A") {
			$scope.sortOption1 = "A-Z";
			$scope.currentList = createSortedList($scope.currentList.sort(sortByWordDescending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		}
	};

	//SortOption2
	var sortByPartOrder = 0;
	$scope.sortByPart = function() {
		if (sortByPartOrder === 0) {
			sortByPartOrder = 1;
			$scope.currentList = createSortedList($scope.currentList.sort(sortByPartAscending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		} else {
			sortByPartOrder = 0;
			$scope.currentList = createSortedList($scope.currentList.sort(sortByPartDescending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		}
	};

	//SortOption3
	var sortByTimeAddedOrder = 0;
	$scope.sortByTimeAdded = function() {
		if (sortByTimeAddedOrder === 0) {
			sortByTimeAddedOrder = 1;
			$scope.currentList = createSortedList($scope.currentList.sort(sortByTimeAddedAscending));
			$scope.pageList = createPageList($scope.currentList, $scope.currentPage, $scope.wordCount);
		} else {
			sortByTimeAddedOrder = 0;
			$scope.currentList = createSortedList($scope.currentList.sort(sortByTimeAddedDescending));
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