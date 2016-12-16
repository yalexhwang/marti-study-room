martiApp.controller('signinCtrl', function($scope, $rootScope, $http) {
	$scope.signin = function() {
		var passcode = {passscode: $scope.passcode};
		console.log(passcode);
		$http.post(url + '/signin', passcode)
		.then(function success(rspns) {
			console.log(rspns);
		}, function fail(rspns) {
			console.log(rspns);
		});
	};
});
