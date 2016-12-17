martiApp.controller('martiCtrl', function($scope, $rootScope, $http, $cookies, $location, WordBankService) {
	$scope.wordCover = 0;
	$scope.partCover = 0;
	$scope.definitionCover = 0;

	$scope.signout = function() {
		console.log('signout');
		$http.post(url + '/signout', $cookies.getObject('user'))
		.then(function success(rspns) {
			if (rspns.data.passFail) {
				$cookies.remove('user');
				$location.path('#/');
			} else {
				//alert: try again
			}
		}, function fail(rspns) {
			//alert: try again
		});
	};

	var index = 0;
	WordBankService.getFullList()
	.then(function success(rspns) {
		console.log(rspns);
		$scope.fullList = createFullList(rspns.data.doc, convertPartName, convertLngName);
		$scope.currentList = createCurrentList($scope.fullList, 'all');
		console.log($scope.currentList);
		$scope.word = $scope.currentList[index];
		$scope.totalPage = $scope.currentList.length;
	}, function fail(rspns) {

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
			$scope.currentList = createCurrentList($scope.fullList, 'all');
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