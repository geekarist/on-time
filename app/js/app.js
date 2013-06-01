angular.module('onTime', [])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/timesheet', {templateUrl: 'index.html',   controller: Timesheet})
			.otherwise({redirectTo: '/timesheet'})
	}])
