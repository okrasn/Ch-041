(function () {
    'use strict';
    angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService,articlesService, dashboardService) {
        $scope.obj = {};
        $scope.categories = feedsService.CATEGORIES;
        $scope.error = null;
        $scope.modalShown = false;
        $scope.articles = articlesService.articles;
        $scope.isFavourites = articlesService.checkIfFavourites;
        $scope.favForAdd = {};
        $scope.addFavourite = function (article) {
            $scope.error = null;
            $scope.modalShown = !$scope.modalShown;
            $scope.favForAdd = article;
        }
        $scope.confirmAddFavourite = function () {
            $scope.favForAdd.category = $scope.obj.category;
            console.log($scope.obj.category);
            articlesService.addFavourite($scope.favForAdd).then(function (res) {
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
        $scope.removeFavourite = function (article) {
            articlesService.removeFavourite(article).then(function (res) {
                $state.reload("dashboard");
            }, function (err) {
                console.log(err);
            });
        }
        $scope.getArticleDate = function (date) {
            var postDate = new Date(Date.parse(date)),
                dd = postDate.getDate(),
                mm = postDate.getMonth() + 1,
                yyyy = postDate.getFullYear(),
                hh = postDate.getHours(),
                min = postDate.getMinutes();

            if (hh.toString().length === 1) {
                hh = '0' + hh;
            }
            if (min.toString().length === 1) {
                min = '0' + min;
            }

            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return dd + '/' + mm + '/' + yyyy + " " + hh + ":" + min;
        }
    }]);
})();