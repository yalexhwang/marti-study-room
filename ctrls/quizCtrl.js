martiApp.controller('quizCtrl', function($scope, $rootScope, $location, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}

	$scope.quizStarted = 0;

	WordBankService.getFullList()
	.then(function success(rspns) {
		$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
	}, function fail(rspns) {
		console.log('error while getting the full list');
		console.log(rspns.data);
	});

	$scope.allSelected = function() {
		$scope.part0 = 0;
		$scope.part1 = 0;
		$scope.part2 = 0;
		$scope.part3 = 0;
		$scope.part4 = 0;
		$scope.part5 = 0;
		$scope.part6 = 0;
		$scope.part7 = 0;

	};

	$scope.startQuiz = function() {
		console.log($scope.partCategory);
		console.log($scope.nmOfQs);
		console.log($scope.choices4);
		console.log($scope.choices5);
		$scope.quizStarted = 1;
		$scope.partCategory = "";
		$scope.numOfQs = "";
		$scope.choices = "";


	};

});