angular.module('rssreader')
    .controller('ProfileController', ['Upload', 'profileService', '$scope', 
        'authService', '$window', 'themeService', 
        function (Upload, profileService, $scope,
        authService, $window, themeService ) {
    
    $scope.upload = profileService.upload;
   $scope.submit = profileService.submit;

    $scope.user = authService.currentUser;
    $scope.updateTheme = function () {
        themeService.layout = $scope.layout;
        console.log("Theme update");
        console.log("Theme:" + themeService.layout);
    };
    $scope.layout = themeService.layout;
    $scope.layouts = themeService.layouts;
}]);