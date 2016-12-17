martiApp.controller('martiCtrl', function($scope, $rootScope, $http, $cookies, $location) {
	$rootScope.sginedIn = 0;

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
});