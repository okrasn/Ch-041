(function () {
	'use strict';
	angular.module('rssreader').controller('NavbarController', ['$scope', '$state','profileService', 'authService', 'dashboardService', 'transfer', 'accountInfo', '$auth',
		function ($scope, $state,profileService, authService, dashboardService, transfer, accountInfo, $auth) {
			$scope.isLoggedIn = authService.isLoggedIn;
			$scope.isDashboard = function () {
				return /dashboard/.test($state.current.name);
			}
			$scope.currentUser = authService.currentUser;
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
			$scope.getProfile = function () {
				accountInfo.getProfile().then(function (response) {
					if ($auth.isAuthenticated()) {
						var lenght = response.data.user.length;
						for (var i = 0; i < lenght; i++) {
							if (response.data.user[i].email === $auth.getPayload().email) {
								$scope.profile = response.data.user[i];
							}
						}
					}
				})
			};
			$scope.getImage = function(){
				return profileService.getImage();
			};
			$scope.getProfile();
	}]);
})();