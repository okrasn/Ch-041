(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', 'themeService', 'dashboardService', function ($scope, themeService, dashboardService) {
		$scope.layout = themeService.getTheme;
		$scope.temp = "some text";
		$scope.loadingIcon = dashboardService.isLoading;
	}]);
})();