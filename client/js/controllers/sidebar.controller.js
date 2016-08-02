angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', function ($scope, $state, feedsService, articlesService) {
    $scope.feeds = feedsService.feedsDictionary;

    $scope.getAll = function () {
        articlesService.getAllArticles();
        $state.go("dashboard.th-large");
    }
    $scope.getByFeed = function (id) {
        articlesService.getArticlesByFeed(id);
        $state.go("dashboard.th-large");
    }
    $scope.getByCat = function (cat) {
        articlesService.getArticlesByCat(cat);
        $state.go("dashboard.th-large");
    }
    
    
    $scope.removeFeed = function (feedId) {
        feedsService.removeFeed(feedId);
        $state.reload();
    }
}]);