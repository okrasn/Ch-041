angular.module('rssreader').controller('AuthController', ['$scope', '$state', 'authService', function ($scope, $state, authService) {
    $scope.user = {};

    $scope.register = function () {
        authService.register($scope.user).error(function (error) {
            $scope.error = error;
        }).then(function () {
            $state.go('home');
        });
    };

    $scope.logIn = function () {
        console.log($scope.user);
        authService.logIn($scope.user).error(function (error) {
            console.log(error);
            $scope.error = error;
        }).then(function () {
            $state.go('dashboard', {id: authService.userID()});
        });
    };
}]);
