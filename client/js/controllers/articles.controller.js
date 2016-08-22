(function () {
    'use strict';
    angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'toasterService', 'dateFilter', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, toasterService, dateFilter, feedsService, articlesService, dashboardService) {
        $scope.obj = {};
        $scope.categories = feedsService.CATEGORIES;
        $scope.error = null;
        $scope.modalShown = false;
        $scope.articles = articlesService.articles;
        $scope.isFavourites = articlesService.checkIfFavourites;
        $scope.favForAdd = {};
        $scope.favForRemove = {};
        $scope.articleForShare = {};
        $scope.addFavourite = function (article) {
            $scope.error = null;
            $scope.modalShown = !$scope.modalShown;
            $scope.favForAdd = article;
        }
        $scope.confirmAddFavourite = function () {
            $scope.favForAdd.category = $scope.obj.category;
            console.log($scope.obj.category);
            articlesService.addFavourite($scope.favForAdd).then(function (res) {
                toasterService.success("Article marked as favourite", $scope);
                $state.reload("dashboard");
            }, function (err) {
                console.log(err);
                if (!err.data)
                    $scope.error = err.message;
                else $scope.error = err.data.message;
            });
        }
        $scope.cancelAddFavourite = function () {
            $scope.modalShown = false;
            $scope.favForAdd = {};
        }
        $scope.share = function (article) {
            $scope.error = null;
            $scope.modalShareShown = !$scope.modalShareShown;
            $scope.articleForShare = article;
        }
        $scope.cancelSharing = function () {
            $scope.modalShareShown = false;
            $scope.articleForShare = {};
        }
        $scope.removeFavourite = function (article) {
            $scope.favForRemove = article;
            toasterService.confirmFavArticleDelete("feed", $scope);
        }
        $scope.confirmRemoveFavourite = function () {
            articlesService.removeFavourite($scope.favForRemove).then(function (res) {
                toasterService.success("Article removed from favourites", $scope);
                $state.reload("dashboard");
            }, function (err) {
                console.log(err);
            });
        }
        $scope.getArticleDate = function (date) {
            return dateFilter(new Date(Date.parse(date)), "dd/MM/yy HH:mm");
        }
    }]);
})();