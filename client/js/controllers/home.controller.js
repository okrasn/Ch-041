angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', 'feedsService', function ($scope, $state, authService, dashboardService, feedsService) {
    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;

    $scope.OnFeeds = function () {
        if (authService.isLoggedIn()) {
            console.log(feedsService.getAllFeeds());
            if (feedsService.getDictionary().length == 0) {
                $state.go('dashboard.addFeed');
            } else {
                $state.go('dashboard.' + dashboardService.currentView, {
                    id: authService.userID()
                });
            }
        } else {
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