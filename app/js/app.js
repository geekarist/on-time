angular.module('onTime', ['ui.bootstrap'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when(
				'/#access_token=:accessToken&token_type=:tokenType&expires_in=:expiresIn', 
				{templateUrl: 'index.html',   controller: Timesheet})
			.when('/timesheet', {templateUrl: 'index.html',   controller: Timesheet})
			.otherwise({redirectTo: '/timesheet'})
	}])
