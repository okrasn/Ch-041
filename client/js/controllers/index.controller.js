(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', 'profileService', 'authService', '$window', 'themeService', function ($scope, profileService, authService, $window, themeService) {
	$scope.getTheme = function() {
			if(authService.isLoggedIn()) {
				return profileService.refreshProfileData().colorTheme;
			}else {
				return "theme1";
			}
		}
	}]);
})();