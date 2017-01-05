martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, $location, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}

	//Default Setting
	$scope.showNotif = 0;
	$scope.currentPage = 1;
	$scope.wordCount = 10;
	$scope.wordCountMax = $scope.fullList.length;
	var sortByWord = {
		on: 0,
		reverse: 0
	};
	var sortByPart = {
		on: 0,
		reverse: 0
	};
	var sortByTime = {
		on: 0,
		reverse: 0
	};

	WordBankService.getFullList()
	.then(function success(rspns) {
		$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
		//Current List for Word Bank page
		$scope.wordBankList = createCurrentList($scope.fullList, 'All');
		//Create the curret page list
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		//Create the page array
		$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);
	}, function fail(rspns) {
		console.log(rspns);
	});

	//Adding Korean
	$scope.KOR = {};
	$scope.addKOR = function() {
		$scope.KOR.language = 'k';
		WordBankService.add($scope.KOR)
		.then(function success(rspns) {
			if (rspns.data.passFail === 1) {
				$scope.notifMessage = "Added!";
				$scope.showNotif = 1;
				$scope.showUpdateBtn = 1;
				$scope.KOR = {};
			} else if (rspns.data.passFail === 2) {
				$scope.notifMessage =  $scope.KOR.word + " is already in Word Bank.";
				$scope.showNotif = 1;
			}
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	$scope.updateFullList = function() {
		WordBankService.getFullList()
		.then(function success(rspns) {
			$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
			console.log($scope.partCategory);
			if ($scope.partCategory) {
				console.log('there is');
				$scope.wordBankList = createCurrentList($scope.fullList, $scope.partCategory);
			} else {
				console.log('~~~~all');
				$scope.wordBankList = createCurrentList($scope.fullList, "All");
			}
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
			$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);
			//Depends on sort setting
			console.log(sortByWord);
			console.log(sortByPart);
			console.log(sortByTime);

			if (sortByWord.on) {
				if (sortByWord.reverse) {

				} else {

				}
			} else if (sortByPart.on) {
				if (sortByWord.reverse) {

				} else {
					
				}
			} else if (sortByTime.on) {
				if (sortByWord.reverse) {

				} else {
					
				}
			}
			$scope.showNotif = 0;
			$scope.showUpdateBtn = 0;
		}, function fail(rspns) {
			console.log(rspns);
			$scope.notifMessage = "Update failed, try again.";
		});
	};

	//Update Words Per Page View
	$scope.updateNumPerPage = function() {
		if ($scope.wordCount == 0) {
			$scope.wordCount = $scope.fullList.length;
		}
		var lastPage = Math.ceil($scope.wordBankList.length / $scope.wordCount);
		if ($scope.currentPage > lastPage) {
			$scope.currentPage = lastPage;
		}
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);
	};

	//Update part category
	$scope.updatePartCategory = function() {
		console.log($scope.partCategory);
		$scope.wordBankList = createCurrentList($scope.fullList, $scope.partCategory);
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);
	};

	//Sort Option1
	$scope.sortByWord = function() {
		sortByPart.on = 0;
		sortByTime.on = 0;


		if (sortByWord === 0) {
			sortByWord = 1;

			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByWordAscending));
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		} else if (sortByWord === 1) {
			sortByWord = 2;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByWordDescending));
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		} else if (sortByWord === 2) {
			sortByWord = 1;
		}
	};

	//Sort Option2
	$scope.sortByPart = function() {
		sortByWord.on = 0;
		sortByTime.on = 0;
		if (sortByPart === 0) {
			sortByPartOrder = 1;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByPartAscending));
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		} else if (sortByPart === 1) {
			sortByPart = 2;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByPartDescending));
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		} else if (sortByPart === 2) {
			sortByPart = 1;
		}
	};

	//SortOption3
	$scope.sortByTime = function() {
		sortByWord.on = 0;
		sortByPart.on = 0;
		if (sortByTime === 0) {
			sortByTimeAddedOrder = 1;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByTimeAddedAscending));
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		} else if (sortByTime === 1) {
			sortByTimeAddedOrder = 2;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByTimeAddedDescending));
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		} else if (sortByTime === 2) {
			sortByTime = 1;
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
				//!!!Sort/View Option after add/remove!!!
				$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
				$scope.wordBankList = createCurrentList($scope.fullList, 'All');
				$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
				$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);
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
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		}
	};
	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pages.length) {
			$scope.currentPage++;
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		}
	};
	$scope.goToPage = function(page) {
		$scope.currentPage = page;
		$scope.pageList = createPageList($scope.wordBankList, page, $scope.wordCount);
	};

});