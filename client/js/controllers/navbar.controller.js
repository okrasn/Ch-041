(function () {
    'use strict';
    angular.module('rssreader').controller('NavbarController', ['$scope', '$state', 'authService', 'dashboardService', function ($scope, $state, authService, dashboardService) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.currentUser = authService.currentUser;
        $scope.logOut = function () {
            authService.logOut();
            $state.go("home");
        }
        $scope.goHome = function () {
            if ($scope.isLoggedIn()) {
                $state.go("dashboard");
            } else {
                $state.go("home");
            }
        }
        $scope.toggleSidebar = function () {
            console.log();
            dashboardService.sidebar = !dashboardService.sidebar;
        }
    }]);
})();