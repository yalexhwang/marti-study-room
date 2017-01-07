martiApp.controller('quizCtrl', function($scope, $rootScope, $location, $cookies, WordBankService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}
	$scope.user = $cookies.getObject('user');

	//Default Setting
	$scope.showQuizSetting = 1;
	$scope.showQuiz = 0;
	$scope.showResult = 0;
	$scope.quizOption1 = 5;
	$scope.quizOption2 = "All";
	$scope.quizOption3 = 4;
	$scope.quizOption4 = "No";
	var userAnswers = [];
	userAnswers.length = $scope.quizOption1;

	WordBankService.getFullList()
	.then(function success(rspns) {
		$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
		console.log($scope.fullList);
	}, function fail(rspns) {
		console.log(rspns);
	});

	$scope.start = function() {
		$scope.quizList = [];
		var fullList = $scope.fullList;

		if ($scope.quizOption4 == 1) {
			$scope.showNotif = 1;
			$scope.notifMessage = "Timed feature is currently unavailable."
			return false;
		}

		if ($scope.quizOption2 === "All") {
			$scope.quizList = shuffleArray(fullList).slice(0, $scope.quizOption1);
			for (var i = 0; i < $scope.quizList.length; i++) {
				var options = [];
				for (var j = 0; j < $scope.fullList.length; j++) {
					if ($scope.quizList[i].rootIndex !== $scope.fullList[j].rootIndex) {
						options.push($scope.fullList[j]);
					}
				}
				options = shuffleArray(options).slice(0, $scope.quizOption3 - 1);
				options.push($scope.quizList[i]);
				$scope.quizList[i].answerOptions = shuffleArray(shuffleArray(options));
			}
		} else {
			var subList = [];
			for (var i = 0; i < fullList.length; i++) {
				if (fullList[i].part == $scope.quizOption2) {
					$scope.quizList.push(fullList[i]);
					subList.push(fullList[i]);
				}
			}
			console.log(subList);
			$scope.quizList = shuffleArray($scope.quizList).slice(0, $scope.quizOption1);
			for (var i = 0; i < $scope.quizList.length; i++) {
				var options = [];
				for (var j = 0; j < subList.length; j++) {
					if ($scope.quizList[i].rootIndex !== subList[j].rootIndex) {
						options.push(subList[j]);
					}
				}
				options = shuffleArray(options).slice(0, $scope.quizOption3 - 1);
				options.push($scope.quizList[i]);
				$scope.quizList[i].answerOptions = shuffleArray(shuffleArray(options));
			}
		}
		console.log($scope.quizList);

		if ($scope.quizList.length === 0) {
			$scope.showQuizNotif = 1;
			$scope.notifMessage = "Sorry, there is no " + convertPartName(Number($scope.quizOption2)); + " in Word Bank."
		} else {
			$scope.showQuiz = 1;
			$scope.showQuizSetting = 0;
			$scope.showResult = 0;
			$scope.today = new Date().toString().slice(3, 15) + ", " + new Date().toString().slice(0, 3) + "";
		}
	};

	$scope.select = function(questionIndex, answerIndex) {
		userAnswers[questionIndex] = answerIndex;
	};
	
	$scope.submit = function() {
		console.log(userAnswers);
		$scope.showResult = 1;
		$scope.resultIncorrect = [];
		$scope.resultCorrect = [];
		for (var i = 0; i < userAnswers.length; i++) {
			if ($scope.quizList[i].answerOptions[userAnswers[i]].rootIndex === $scope.quizList[i].rootIndex) {
				$scope.resultCorrect.push($scope.quizList[i]);
			} else {
				$scope.quizList[i].questionNo = i + 1;
				$scope.quizList[i].answerOptions = $scope.quizList[i].answerOptions[userAnswers[i]];
				$scope.resultIncorrect.push($scope.quizList[i]);
				$scope.showIncorrectList = 1;
			}
		}
		$scope.score = $scope.resultCorrect.length / $scope.quizList.length * 100;
		$scope.showResult = 1;
		console.log($scope.resultIncorrect);
	};

});