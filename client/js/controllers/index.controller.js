(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', 'profileService', 'dashboardService', 'authService', '$window', 'themeService', function ($scope, profileService, dashboardService, authService, $window, themeService) {
		$scope.loadingIcon = dashboardService.isLoading;
		$scope.getTheme = function () {
			if (authService.isLoggedIn()) {
				return profileService.refreshProfileData().colorTheme;
			} else {
				return "theme1";
			}
		}
	}]);
})();