angular.module('rssreader').controller('ProfileController', ['$scope', '$state', 'authService', '$window', 'themeService', function ($scope, $state, authService, $window, themeService) {
    $scope.user = {};
    $scope.updateTheme = function () {
        themeService.layout = $scope.layout;
        console.log("Theme update");
        console.log("Theme:" + themeService.layout);
    }
    $scope.layout = themeService.layout;
    $scope.layouts = themeService.layouts;
}]);