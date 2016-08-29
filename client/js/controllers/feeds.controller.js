(function () {
    'use strict';
    angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$http', 'toasterService', 'feedsService', 'dashboardService', 'articlesService', 'authService', function ($scope, $state, $http, toasterService, feedsService, dashboardService, articlesService, authService) {
        $scope.obj = {};
        $scope.feeds = feedsService.feedsDictionary;
        $scope.categories = feedsService.CATEGORIES;
        $scope.addingNewCategory = false;
        $scope.newCategory = null;
        $scope.checkIfNew = function () {
            if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
                $scope.addingNewCategory = true;
            }
            else {
                $scope.addingNewCategory = false;
                $scope.newCategory = null;
            }
        }
        $scope.addFeed = function () {
            if ($scope.newCategory) {
                $scope.obj.category = $scope.newCategory;
            }
            $scope.addingNewCategory = false;
            $scope.error = '';
            console.log($scope.obj);
            feedsService.addFeed($scope.obj)
                .then(function (res) {
                    toasterService.success("Feed successfully added");
                    $state.reload("dashboard");
                }, function (err) {
                    if (!err.data)
                        $scope.error = err.message;
                    else $scope.error = err.data.message;
                });
        }
    }]);
})();