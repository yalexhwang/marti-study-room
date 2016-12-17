martiApp.controller('signinCtrl', function($scope, $rootScope, $http, $location, $cookies) {
	$scope.showSignInNotif = 0;
	if ($rootScope.signedIn) {
		$location.path('#/');
	}

	$scope.signin = function() {
		var pcObj = {passcode: $scope.passcode};
		$http.post(url + '/signin', pcObj)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail) {
				$cookies.putObject('user', rspns.data.doc);
				$location.path('#/');
			} else {
				$scope.passcode = "";
				$scope.showSignInNotif = 1;
			}
		}, function fail(rspns) {
			console.log(rspns);
			$scope.passcode = "";
			$scope.showSignInNotif = 1;
		});
	};
});
