angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
    $scope.feeds = feedsService.feedsDictionary;

    $scope.getAll = function () {
        articlesService.getAllArticles();
        dashboardService.setTitle("All");
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByFeed = function (id, title) {
        articlesService.getArticlesByFeed(id);
        dashboardService.setTitle(title);
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByCat = function (cat) {
        articlesService.getArticlesByCat(cat);
        dashboardService.setTitle(cat);
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.removeFeed = function (feedId) {
        feedsService.removeFeed(feedId);
        $state.reload();
    }
}]);