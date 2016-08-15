(function () {
    'use strict';
    angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'articlesService', 'dashboardService', function ($scope, $state, articlesService, dashboardService) {
        $scope.articles = articlesService.articles;
        $scope.isFavourites = articlesService.checkIfFavourites;
        $scope.addFavourite = function (article) {
            articlesService.addFavourite(article).then(function (res) {
                $state.reload("dashboard");
                dashboardService.successMsg = "Article successfully added to favourites"
            }, function (err) {
                console.log(err);
                dashboardService.alertMsg = err.data.message;
            });
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