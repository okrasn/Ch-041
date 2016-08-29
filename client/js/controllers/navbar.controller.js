(function () {
	'use strict';
	angular.module('rssreader').controller('NavbarController', ['$scope', '$state', 'authService', 'dashboardService', 'transfer', 'accountInfo', '$auth',
		function ($scope, $state, authService, dashboardService, transfer, accountInfo, $auth) {
			$scope.isLoggedIn = authService.isLoggedIn;
			$scope.isDashboard = function () {
				return /dashboard/.test($state.current.name);
			}
			$scope.currentUser = authService.currentUser;
			$scope.toggleSidebar = function () {
				dashboardService.sidebar = !dashboardService.sidebar;
				$scope.getProfile();
			}
			$scope.hideSidebar = function () {
				dashboardService.sidebar = false;
			}
			$scope.logOut = function () {
				authService.logOut();
				$state.go("home");
			}
			$scope.onEmblem = function () {
				if (authService.isLoggedIn()) {
					$state.reload('dashboard');
				} else {
					$state.go("home");
				}
			}
			$scope.getProfile = function () {
				accountInfo.getProfile().then(function (response) {
					if ($auth.isAuthenticated()) {
						var lenght = response.data.user.length;
						for (var i = 0; i < lenght; i++) {
							if (response.data.user[i].email === $auth.getPayload().email) {

								$scope.profile = response.data.user[i];
							}
						}
						console.log($scope.profile);
					}
				})
			};
			$scope.getProfile();
		}]);
})();