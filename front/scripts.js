var martiApp = angular.module('martiApp', ['ngRoute']);
var url = "http://localhost:3000";

martiApp.service('WordBankService', function($http, $q) {
	this.add = function(newWord) {
		var def = $q.defer();
		$http.post(url + '/add', newWord)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};

	this.getFullList = function() {
		var def = $q.defer();
		$http.post(url + '/get_full_list')
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};
});



martiApp.controller('martiCtrl', function($scope, WordBankService) {
	$scope.test = "hi";
	WordBankService.getFullList()
	.then(function success(rspns) {
		console.log(rspns);
	}, function fail(rspns) {
		console.log(rspns);
	});
});

martiApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'martiCtrl',
		templateUrl: 'templates/home.html'
	});
});