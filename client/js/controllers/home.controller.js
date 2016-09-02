(function () {
	'use strict';
	angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', 'feedsService', function ($scope, $state, authService, dashboardService, feedsService) {
		$scope.isLoggedIn = authService.isLoggedIn;
		$scope.currentUser = authService.currentUser;
		$scope.onFeeds = function () {
			if (authService.isLoggedIn()) {
				$state.go('dashboard.' + dashboardService.getViewMode(), {
					id: authService.userID()
				});
			} else {
				$state.go('home');
			}
		}
		$scope.onFeeds();
		$scope.onRegister = function () {
			$state.go('register');
		}
		$scope.onLogin = function () {
			$state.go('login');
		}
	}]);
})();