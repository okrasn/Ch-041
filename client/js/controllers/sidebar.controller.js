angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
    $scope.feeds = feedsService.feedsDictionary;

    $scope.getAll = function () {
        // if there is only one category and feed, return this feed articles
        if ($scope.feeds.length === 1 && $scope.feeds[0].values.length === 1) {
            $scope.getByFeed($scope.feeds[0].values[0]._id, $scope.feeds[0].values[0].title);
        } else {
            articlesService.getAllArticles();
            dashboardService.resetFeedId();
        }
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByFeed = function (id, title) {
        articlesService.getArticlesByFeed(id);
        dashboardService.setTitle(title);
        dashboardService.setFeedId(id);
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByCat = function (cat, index) {        
        // if there is only one feed within selected category, return its articles
        if ($scope.feeds[index].values.length == 1) {
            $scope.getByFeed($scope.feeds[index].values[0]._id, $scope.feeds[index].values[0].title);
        } else {
            articlesService.getArticlesByCat(cat);
            dashboardService.resetFeedId();
        }

        $state.go("dashboard." + dashboardService.currentView);
    }
}]);