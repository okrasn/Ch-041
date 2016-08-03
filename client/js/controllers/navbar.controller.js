angular.module('rssreader').controller('NavbarController', ['$scope', '$state', 'authService', function ($scope, $state, authService) {
    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;
    $scope.logOut = function(){
        authService.logOut();
        $state.go("home");
    } 
    $scope.goHome = function(){
        $state.go("home");
    }
}]);