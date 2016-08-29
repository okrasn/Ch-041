(function () {
	'use strict';
	angular.module('rssreader').controller('NavbarController', ['$scope', '$state', 'profileService', 'authService', 'transfer', 'accountInfo', '$auth',
	function ($scope, $state, profileService, authService, transfer, accountInfo, $auth) {
			$scope.isLoggedIn = authService.isLoggedIn;
			$scope.currentUser = authService.currentUser;
			$scope.logOut = function () {
				authService.logOut();
				$state.go("home");
			}
			$scope.goHome = function () {
				if ($scope.isLoggedIn()) {
					$state.go("dashboard");
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