(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', 'authService', '$window', 'themeService', 'dashboardService', function ($scope, authService, $window, themeService, dashboardService) {
		$scope.layout = themeService.getTheme;
		$scope.temp = "some text";
		$scope.loadingIcon = dashboardService.isLoading;
	}]);
})();