angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', function ($scope, $state, authService) {
    $scope.header = 'Welcome to Rss Reader';
    
    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;
    
    $scope.OnFeeds = function () {
        //console.log("OnFeeds");
        if (authService.isLoggedIn())
            $state.go('dashboard.th-large', {id: authService.userID()});
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