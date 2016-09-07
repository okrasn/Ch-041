(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', 'authService', '$window', 'themeService', function ($scope, authService, $window, themeService) {
		$scope.layout = themeService.getTheme;
	}]);
})();