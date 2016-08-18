(function () {
    'use strict';
    angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService,articlesService, dashboardService) {
        $scope.obj = {};
        $scope.categories = feedsService.CATEGORIES;

        $scope.modalShown = false;
        $scope.articles = articlesService.articles;
        $scope.isFavourites = articlesService.checkIfFavourites;
        $scope.favForAdd = {};
        $scope.addFavourite = function (article) {
            $scope.modalShown = !$scope.modalShown;
            $scope.favForAdd = article;
        }
        $scope.confirmAddFavourite = function () {
            $scope.favForAdd.category = $scope.obj.category;
            console.log($scope.obj.category);
            articlesService.addFavourite($scope.favForAdd).then(function (res) {
                $state.reload("dashboard");
                //dashboardService.successMsg = "Article successfully added to favourites"
            }, function (err) {
                console.log(err);
                //dashboardService.alertMsg = err.data.message;
            });
        }
        $scope.cancelAddFavourite = function () {
            $scope.modalShown = false;
            $scope.favForAdd = {};
        }
        $scope.removeFavourite = function (article) {
            articlesService.removeFavourite(article).then(function (res) {
                $state.reload("dashboard");
            }, function (err) {
                console.log(err);
            });
        }
    }]);
})();