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

		$scope.fadeIn = function ($el) {
		    $el.removeClass('not-visible');
		    $el.addClass('fade-in-1s');
		}

		$scope.slideFromLeft = function ($el) {
		    $el.removeClass('not-visible');
		    $el.addClass('slide-from-left');
		}

		$scope.slideFromRight = function ($el) {
		    $el.removeClass('not-visible');
		    $el.addClass('slide-from-right');
		}
	}]);
})();