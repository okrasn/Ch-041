angular.module('rssreader').controller('AuthController', ['$scope', '$state', 'authService', '$window', function ($scope, $state, authService, $window) {
    $scope.user = {};
    $scope.session;

    $scope.register = function () {
        authService.register($scope.user).error(function (error) {
            $scope.error = error;
        }).then(function () {
            $state.go('home');
        });
    };

    $scope.logIn = function () {
        authService.logIn($scope.user, $scope.session).error(function (error) {
            $scope.error = error;
        }).then(function () {
            if (!$scope.session) {
                console.log("Not checked");
                $scope.onExit = function () {
                    auth.logOut();
                };
                $window.onbeforeunload = $scope.onExit;
            }
            else
            console.log("Checked");

            $state.go('dashboard.feed', {
                id: authService.userID()
            });
        });
    };
}]);