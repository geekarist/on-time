angular.module('onTime', ['ui.bootstrap'], function($locationProvider) {
      $locationProvider.html5Mode(false)
})

	// .config(['$routeProvider', function($routeProvider) {
	// 	$routeProvider
	// 		.when('/timesheet', {templateUrl: 'index.html',   controller: Timesheet})
	// 		.otherwise({redirectTo: '/timesheet'})
	// }])
