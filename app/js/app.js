angular.module('onTime', ['ui.bootstrap'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/timesheet', {templateUrl: 'index.html',   controller: Timesheet})
			.otherwise({redirectTo: '/timesheet'})
	}])
