(function () {
    'use strict';
    angular.module('rssreader').controller('NavbarController', ['$scope', '$state', 'authService' ,'transfer', function ($scope, $state, authService, transfer) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.currentUser = authService.currentUser;
        $scope.logOut = function () {
            authService.logOut();
            $state.go("home");
        }
        $scope.goHome = function () {
            if ($scope.isLoggedIn()) {
                $state.go("dashboard");
		$scope.account = transfer.getObj();
            } else {
                $state.go("home");
            }
        }
    }]);
})();