angular.module('rssreader').controller('FeedsController', ['$scope', '$state', 'feedsService', 'authService', function ($scope, $state, feedsService, authService) {
    $scope.test = 'Hello world!';
    $scope.obj = {};
    $scope.feeds = feedsService.getFeeds();

    $scope.addFeed = function () {
        feedsService.addFeed(authService.userID(), {
            title: $scope.obj.title,
            link: $scope.obj.link,
        });
        $scope.obj.title = '';
        $scope.obj.link = '';
        $scope.feeds = feedsService.getFeeds();
    }
    $scope.removeFeed = function(feedId){
        feedsService.removeFeed(authService.userID(), feedId);
        //$scope.feeds = feedsService.getFeeds();
        $state.reload();
    }
}]);