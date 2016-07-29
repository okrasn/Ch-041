angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', function ($scope, $state, authService) {
    $scope.userId = authService.userID();
    $scope.header = 'Welcome to Rss Reader';
    $scope.OnFeeds = function () {
        //console.log("OnFeeds");
        if (authService.isLoggedIn())
            $state.go('dashboard', {id: $scope.userId});
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