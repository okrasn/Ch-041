angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', function ($scope, $state, authService, dashboardService) {

    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;
    
    $scope.OnFeeds = function () {
        //console.log("OnFeeds");
        if (authService.isLoggedIn())
            $state.go('dashboard.' + dashboardService.currentView, {id: authService.userID()});
        else{
            alert('Unauthtorized');
        }
    }
    $scope.OnRegister = function () {
        $state.go('register');
    }
    $scope.OnLogin = function () {
        $state.go('login');
    }
}]);