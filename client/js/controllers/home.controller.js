angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', 'articlesService', function ($scope, $state, authService, dashboardService, articlesService) {
    $scope.isLoggedIn = authService.isLoggedIn;
    $scope.currentUser = authService.currentUser;

    $scope.OnFeeds = function () {
        if (authService.isLoggedIn()) {
            if (articlesService.articles.length == 0) {
                console.log("Empty");
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