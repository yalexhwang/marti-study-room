martiApp.controller('homeCtrl', function($scope, $rootScope, $http, $cookies, $location, WordBankService) {
	$scope.wordCover = 0;
	$scope.partCover = 0;
	$scope.definitionCover = 0;
	var userCookie = $cookies.getObject('user')
	console.log(userCookie);
	$scope.signout = function() {
		$http.post(url + '/signout', $cookies.getObject('user'))
		.then(function success(rspns) {
			if (rspns.data.passFail === 1) {
				$cookies.remove('user');
				$location.path('#/');
			} else if (rspns.data.passFail === 2) {
				console.log(doc);
				//alert: try again (no matching token)
			} else {
				console.log(doc);
				//alert: try again (query fail)
			}
		}, function fail(rspns) {
			//alert: try again (AJAX call fail)
		});
	};
	console.log('000');
	var index = 0;
	WordBankService.getFullList()
	.then(function success(rspns) {
		console.log(rspns);
		$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
		$scope.currentList = createCurrentList($scope.fullList, 'All');
		console.log($scope.currentList);
		$scope.word = $scope.currentList[index];
		$scope.totalPage = $scope.currentList.length;
	}, function fail(rspns) {
		console.log(rspns);
	});

	$scope.updatePartCategory = function() {
		$scope.currentList = createCurrentList($scope.fullList, $scope.partCategory);
		index = 0;
		$scope.word = $scope.currentList[index];
		$scope.totalPage = $scope.currentList.length;
	};

	$scope.shuffle = function() {
		shuffleArray($scope.currentList);
		console.log($scope.currentList);
		for (var i = 0; i < $scope.currentList.length; i++) {
			$scope.currentList[i].index = i + 1;
		}
		index = 0;
		$scope.word = $scope.currentList[index];
	};

	$scope.unshuffle = function() {
		if ($scope.partCategory == undefined) {
			$scope.currentList = createCurrentList($scope.fullList, 'All');
		} else {
			$scope.currentList = createCurrentList($scope.fullList, $scope.partCategory);
		}
		index = 0;
		$scope.word = $scope.currentList[index];
	}

	$scope.prev = function() {
		if (index >= 1) {
			index -= 1;
			console.log('index: ' + index);
			$scope.word = $scope.currentList[index];
		} else {
			index = $scope.currentList.length - 1;
			$scope.word = $scope.currentList[index];
		}
	};

	$scope.next = function() {
		if (index < $scope.currentList.length - 1) {
			index += 1;
			console.log('index: ' + index);
			$scope.word = $scope.currentList[index];
		} else {
			index = 0;
			$scope.word = $scope.currentList[index];
		}

	};


});