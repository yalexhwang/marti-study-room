martiApp.controller('signinCtrl', function($scope, $rootScope, $http, $location, $cookies) {
	$scope.showSignInNotif = 0;
	if ($rootScope.signedIn) {
		$location.path('#/');
	}

	$scope.pcObj = {};
	$scope.signin = function() {
		// var pcObj = {
		// 	user: $scope.user,
		// 	passcode: $scope.passcode
		// };
		console.log($scope.pcObj);
		$http.post(url + '/signin', $scope.pcObj)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail === 1) {
				$cookies.putObject('user', rspns.data.doc);
				$location.path('#/');
			} else if (rspns.data.passFail === 2) {
				$scope.notifMessage = "Passcode did not match. Try again.";
				$scope.showSignInNotif = 1;
			} else {
				$scope.notifMessage = "Something went wrong. Try again.";
				$scope.showSignInNotif = 1;
			}

			$scope.passcode = "";
			console.log(rspns.data.doc);
		}, function fail(rspns) {
			console.log(rspns);
			$scope.passcode = "";
			$scope.showSignInNotif = 1;
		});
	};

	$scope.guest = function() {
		var pcObj = {passcode: 'test0987'};
		console.log(pcObj);
		$http.post(url + '/signin', pcObj)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail === 1) {
				$cookies.putObject('user', rspns.data.doc);
				$location.path('#/');
			} else if (rspns.data.passFail === 2) {
				$scope.notifMessage = "Passcode did not match. Try again.";
				$scope.showSignInNotif = 1;
			} else {
				$scope.notifMessage = "Something went wrong. Try again.";
				$scope.showSignInNotif = 1;
			}
			$scope.passcode = "";
			console.log(rspns.data.doc);
		}, function fail(rspns) {
			console.log(rspns);
			$scope.passcode = "";
			$scope.showSignInNotif = 1;
		});
	}
});
