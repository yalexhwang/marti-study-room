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