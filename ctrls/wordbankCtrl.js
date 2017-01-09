martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, $location, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}

	//Default Setting
	$scope.showNotif = 0;
	$scope.currentPage = 1;
	var defaultWordCount = 10;
	$scope.wordCount = defaultWordCount;
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
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, defaultWordCount);
		//Create the page array
		$scope.pages = calculatePageView($scope.wordBankList.length, defaultWordCount);
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
		console.log($scope.currentPage);
		console.log($scope.wordCount);
		console.log($scope.partCategory);
		WordBankService.getFullList()
		.then(function success(rspns) {
			$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
			if ($scope.partCategory == undefined) {
				$scope.partCategory = 'All';
			}
			console.log('updated $scope.partCategory');
			console.log($scope.partCategory);
			$scope.wordBankList = createCurrentList($scope.fullList, $scope.partCategory);
			console.log('wordBankList:');
			console.log($scope.wordBankList);

			if ($scope.wordCount == 0) {
			//meaning show 'all', so same as wordBankList.length
			$scope.currentPage = 1;
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordBankList.length);
			$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordBankList.length);
			} else {
				var lastPage = Math.ceil($scope.wordBankList.length / $scope.wordCount);
				if ($scope.currentPage > lastPage) {
					$scope.currentPage = lastPage;
				}
				$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);		
				$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);	
			}

			//Depends on sort setting
			console.log(sortByWord);
			console.log(sortByPart);
			console.log(sortByTime);
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
			//meaning show 'all', so same as wordBankList.length
			$scope.currentPage = 1;
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordBankList.length);
			$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordBankList.length);
		} else {
			var lastPage = Math.ceil($scope.wordBankList.length / $scope.wordCount);
			if ($scope.currentPage > lastPage) {
				$scope.currentPage = lastPage;
			}
			$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);		
			$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);	
		}
	};

	//Update part category
	$scope.updatePartCategory = function() {
		console.log($scope.partCategory);
		console.log($scope.wordCount);
		$scope.wordCount = $scope.wordBankList.length;
		$scope.wordBankList = createCurrentList($scope.fullList, $scope.partCategory);
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
		$scope.pages = calculatePageView($scope.wordBankList.length, $scope.wordCount);
	};

	//Sort Option1
	$scope.sortByWord = function() {
		sortByPart.on = 0;
		sortByTime.on = 0;
		if (sortByWord.on) {
			if (sortByWord.reverse) {
				//sorted (reverse to no reverse)
				sortByWord.reverse = 0;
				$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByWordAscending));
			} else {
				//sorted (no reverse to reverse)
				sortByWord.reverse = 1;
				$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByWordDescending));
			}
		} else {
			//not sorted
			sortByWord.on = 1;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByWordAscending));
		}
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
	};

	//Sort Option2
	$scope.sortByPart = function() {
		sortByWord.on = 0;
		sortByTime.on = 0;
		if (sortByPart.on) {
			if (sortByPart.reverse) {
				//sorted (reverse to no reverse)
				sortByPart.reverse = 0;
				$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByPartAscending));
			} else {
				//sorted (no reverse to reverse)
				sortByPart.reverse = 1;
				$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByPartDescending));
			}
		} else {
			//not sorted
			sortByPart.on = 1;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByPartAscending));
		}
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
	};

	//Sort Option3
	$scope.sortByTime = function() {
		sortByWord.on = 0;
		sortByPart.on = 0;
		if (sortByTime.on) {
			if (sortByTime.reverse) {
				//sorted (reverse to no reverse)
				sortByTime.reverse = 0;
				$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByTimeAscending));
			} else {
				//sorted (no reverse to reverse)
				sortByTime.reverse = 1;
				$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByTimeDescending));
			}
		} else {
			//not sorted
			sortByTime.on = 1;
			$scope.wordBankList = createSortedList($scope.wordBankList.sort(sortByTimeAscending));
		}
		$scope.pageList = createPageList($scope.wordBankList, $scope.currentPage, $scope.wordCount);
	};

	//Remove a word
	$scope.removeWord = function(index) {
		var confirm = $window.confirm('Do you want to remove ' + $scope.pageList[index].word + "?");
		if (confirm) {
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
		}
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