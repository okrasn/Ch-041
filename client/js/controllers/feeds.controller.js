angular.module('rssreader').controller('FeedsController', ['$scope', '$state', 'feedsService', function ($scope, $state, feedsService) {
    $scope.test = 'Hello world!';
    $scope.obj = {};
    $scope.feeds = feedsService.feedsDictionary;
    $scope.categories = feedsService.CATEGORIES;
    
    $scope.addFeed = function () {
        $scope.error = '';
        feedsService.addFeed($scope.obj).then(function(res){
            $state.go("dashboard.th-large");
        }, function(err){
            if(!err.data)
                $scope.error = err.message;
            else $scope.error = err.data.message;
        });
    }
}]);
