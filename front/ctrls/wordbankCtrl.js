martiApp.controller('wordbankCtrl', function($scope, $rootScope, $window, WordBankService) {
	//Initial Setting - forms
	$scope.showFormNotif = 0;
	$scope.showKOR = 1;
	$scope.formTitle = "Add Korean";
	$scope.switchLng = "English";
	//Initial Setting - full list
	$scope.fullListOn = 0;
	$scope.fullListBtn = "Show Full List";

	//Change the form between KOR and ENG
	$scope.toggleForm = function() {
		//Currently unavailable
		$window.alert('Coming Soon');
		// if ($scope.showKOR) {
		// 	$scope.showKOR = 0;
		// 	$scope.formTitle = "Add English"
		// 	$scope.switchLng = "Korean";
		// } else {
		// 	$scope.showKOR = 1;
		// 	$scope.formTitle = "Add Korean";
		// 	$scope.switchLng = "English";
		// }
	};

	// 벗다
	// 사다
	// 팔다
	// 보다

	//Adding Korean
	$scope.KOR = {};
	$scope.addKOR = function() {
		$scope.KOR.language = 'k';
		console.log($scope.KOR);
		WordBankService.add($scope.KOR)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail) {
				$scope.showFormNotif = 1;
				$scope.showSuccess = 1;
				$scope.showFail = 0;
				$scope.addedWord = rspns.data.doc;
				$scope.KOR = {};
			} else {
				$scope.showFormNotif = 1;
				$scope.showFail = 1;
				$scope.showSuccess = 0;
			}
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	//Adding English 
	$scope.ENG = {};
	$scope.addENG = function() {
		$scope.ENG.language = 'e';
		console.log($scope.ENG);
		WordBankService.add($scope.ENG)
		.then(function success(rspns) {
			console.log(rspns);
			if (rspns.data.passFail) {
				$scope.showFormNotif = 1;
				$scope.showSuccess = 1;
				$scope.showFail = 0;
				$scope.addedWord = rspns.data.doc;
				$scope.ENG = {};
			} else {
				$scope.showFormNotif = 1;
				$scope.showFail = 1;
				$scope.showSuccess = 0;
			}
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	$scope.toggleFullList = function() {
		if ($scope.fullListOn) {
			$scope.fullListOn = 0;
			$scope.fullListBtn = "Show Full List";
		} else {
			$scope.fullListOn = 1;
			$scope.fullListBtn = "Hide Full List";
		}
	}

});