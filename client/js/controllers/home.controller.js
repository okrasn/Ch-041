(function () {
    'use strict';
    angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', 'feedsService', function ($scope, $state, authService, dashboardService, feedsService) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.currentUser = authService.currentUser;
         $scope.models = {
            selected: null,
            lists: {
                A: []
            }
        };
        // Generate initial model
        for (var i = 1; i <= 3; ++i) {
            $scope.models.lists.A.push({
                label: "Item A" + i
            });
        }
        $scope.onFeeds = function () {
            if (authService.isLoggedIn()) {
                $state.go('dashboard.' + dashboardService.getViewMode(), {
                    id: authService.userID()
                });
            } else {
                alert('Unauthtorized');
            }
        }
        $scope.onRegister = function () {
            $state.go('register');
        }
        $scope.onLogin = function () {
            $state.go('login');
        }
    }]);
})();