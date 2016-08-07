angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
    $scope.feeds = feedsService.feedsDictionary;
    $scope.getAll = function () {
        console.log("getAll");
        // if there is only one category and feed, return this feed articles
        if ($scope.feeds.length === 1 && $scope.feeds[0].values.length === 1) {
            $scope.getByFeed($scope.feeds[0].values[0]);
        } else {
            console.log("Service");
            articlesService.getAllArticles();
        }
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByFeed = function (feed) {
        //console.log(feed);
        articlesService.getArticlesByFeed(feed);
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByCat = function (cat, index) {        
        // if there is only one feed within selected category, return its articles
        if ($scope.feeds[index].values.length == 1) {
            $scope.getByFeed($scope.feeds[index].values[0]);
        } else {
            articlesService.getArticlesByCat(cat);
        }
        $state.go("dashboard." + dashboardService.currentView);
    }
}]);