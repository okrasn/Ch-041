angular.module('rssreader').controller('FeedsController', ['$scope', '$state', 'feedsService', 'dashboardService', 'articlesService', function ($scope, $state, feedsService, dashboardService, articlesService) {
    $scope.obj = {};
    $scope.feeds = feedsService.feedsDictionary;
    $scope.categories = feedsService.CATEGORIES;
    $scope.addFeed = function () {
        $scope.error = '';
        feedsService.addFeed($scope.obj).then(function (res) {
            articlesService.getAllArticles();
            $state.reload("dashboard");
            articlesService.getAllArticles();
            $state.go("dashboard." + dashboardService.currentView);
//                        articlesService.getAllArticles();

        }, function (err) {
            console.log(err);
            if (!err.data)
                $scope.error = err.message;
            else $scope.error = err.data.message;
        });
        //                 articlesService.getAllArticles();
        //
        //                   $state.reload("dashboard");
        //
        //                    $state.go("dashboard." + dashboardService.currentView);

    }
}]);