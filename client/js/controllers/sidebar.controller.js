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
    $scope.getByCat = function (cat, index) {
//        console.log($scope.feeds[index]);
//        console.log(cat);
        
        // if there is only one feed within selected category, return its articles
        if ($scope.feeds[index].values.length == 1) {
            $scope.getByFeed($scope.feeds[index].values[0]._id, $scope.feeds[index].values[0].title);
        } else {
            articlesService.getArticlesByCat(cat);
            dashboardService.setTitle(cat);
            dashboardService.resetFeedId();
        }

        $state.go("dashboard." + dashboardService.currentView);
    }
}]);