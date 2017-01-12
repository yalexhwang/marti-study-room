martiApp.controller('mypageCtrl', function($scope, $rootScope, TestResultService) {
	if ($rootScope.signedIn === 0) {
		$location.path('/signin');
	}
	console.log('mypageCtrl');
	
	TestResultService.getPreviousResults()
	.then(function success(rspns) {
		console.log(rspns);
		if (rspns.data.passFail) {
			var doc = rspns.data.doc;
			for (var i = 0; i < doc.length; i++) {
				doc[i].createdAt = doc[i].createdAt.slice(0, 10);
				if (doc[i].hasOwnProperty('specified')) {
					doc[i].specified = convertPartName(doc[i].specified) + " only";
				} else {
					doc[i].specified = "All parts";
				}
				if (doc[i].hasOwnProperty("timed")) {
					//Update later with Timed Feature
					doc[i].timed = doc[i].timed;
				} else {
					doc[i].timed = "N/A";
				}
			}
			$scope.previousResults = doc;
			$scope.averageScore = calculateAverage(doc).toFixed(2);
		} else {
			console.log(rspns.data.doc);
		}
	}, function fail(rspns) {
		console.log(rspns);
	});
});