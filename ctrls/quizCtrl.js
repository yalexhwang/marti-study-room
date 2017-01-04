martiApp.controller('quizCtrl', function($scope, $rootScope, $location, $cookies, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}

	$scope.user = $cookies.getObject('user');
	var now = new Date().toString().slice(3, 16) + "(" + new Date().toString().slice(0, 3) + ")";
	$scope.today = now;

	//Same fullList from homeCtrl
	console.log($scope.fullList);
	//Default Setting
	$scope.showNotif = 0;
	$scope.quizOption1 = 20;
	$scope.quizOption2 = "All";
	$scope.quizOption3 = 4;
	$scope.quizOption4 = "No";
	$scope.quizStarted = 0;

	$scope.start = function() {
		$scope.quizList = [];
		console.log($scope.quizOption1);
		console.log($scope.quizOption2);
		console.log($scope.quizOption3);
		console.log($scope.quizOption4);
		
		if ($scope.quizOption4 == 1) {
			console.log('dfadfa');
			$scope.showNotif = 1;
			$scope.notifMessage = "Timed feature is currently unavailable."
			return false;
		}

		if ($scope.quizOption2 === "All") {
			$scope.quizList = shuffleArray($scope.fullList).slice(0, $scope.quizOption1);
		} else {
			for (var i = 0; i < $scope.fullList.length; i++) {
				if ($scope.fullList[i].part == $scope.quizOption2) {
					$scope.quizList.push($scope.fullList[i]);
				}
			}
			$scope.quizList = shuffleArray($scope.quizList).slice(0, $scope.quizOption1);
		}

		//Get an array of possible answer options, including the correct one
		for (var i = 0; i < $scope.quizList.length; i++) {
			var options;
			if (i === 0) {
				options = shuffleArray($scope.quizList.slice(1));
			} else if (i === $scope.quizList.length - 1) {
				options = shuffleArray($scope.quizList.slice(0, $scope.quizList.length - 1));
			} else {
				options = shuffleArray($scope.quizList.slice(0, i).concat($scope.quizList.slice(i + 1)));
			}
			options = options.slice(0, $scope.quizOption3 - 1);
			options.push($scope.quizList[i]);
			$scope.quizList[i].answerOptions = shuffleArray(options);
		}
		console.log($scope.quizList);
		if ($scope.quizList.length === 0) {
			$scope.showNotif = 1;
			$scope.notifMessage = "Sorry, there is no " + convertPartName(Number($scope.quizOption2)); + " in Word Bank."
		} else {
			$scope.quizStarted = 1;
		}
	};

});