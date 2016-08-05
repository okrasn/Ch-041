angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
    $scope.feeds = feedsService.feedsDictionary;

    $scope.getAll = function () {
        articlesService.getAllArticles();
        dashboardService.setTitle("All");
        dashboardService.resetFeedId();
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByFeed = function (id, title) {
        articlesService.getArticlesByFeed(id);
        dashboardService.setTitle(title);
        dashboardService.setFeedId(id);
        $state.go("dashboard." + dashboardService.currentView);
    }
    $scope.getByCat = function (cat) {
        articlesService.getArticlesByCat(cat);
        dashboardService.setTitle(cat);
        dashboardService.resetFeedId();
        $state.go("dashboard." + dashboardService.currentView);
    }
}]);