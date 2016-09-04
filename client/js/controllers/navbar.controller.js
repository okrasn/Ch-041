(function () {
	'use strict';
	angular.module('rssreader').controller('NavbarController', ['$scope', '$state','profileService', 'authService', 'dashboardService', 'transfer', 'accountInfo', '$auth',
		function ($scope, $state,profileService, authService, dashboardService, transfer, accountInfo, $auth) {
			// $scope.profile = profileService.profile;
			$scope.isLoggedIn = authService.isLoggedIn;
			$scope.isDashboard = function () {
				return /dashboard/.test($state.current.name);
			}
			$scope.currentUser = profileService.refreshProfileData;
			$scope.toggleSidebar = function () {
			    angular.element(document.querySelector("#bs-example-navbar-collapse-1")).removeClass('in');
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
			        if ($scope.isDashboard()) {
			            $state.reload('dashboard');
			        }
			        else $state.go("dashboard." + dashboardService.getViewMode());
				} else {
					$state.go("home");
				}
			}
	}]);
})();