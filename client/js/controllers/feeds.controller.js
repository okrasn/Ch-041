angular.module('rssreader').controller('FeedsController', ['$scope', '$state', 'feedsService', 'dashboardService', function ($scope, $state, feedsService, dashboardService) {
    $scope.test = 'Hello world!';
    $scope.obj = {};
    $scope.feeds = feedsService.feedsDictionary;
    $scope.categories = feedsService.CATEGORIES;  
    $scope.addFeed = function () {
        $scope.error = '';
        feedsService.addFeed($scope.obj).then(function(res){
            $state.reload("dashboard");
            $state.go("dashboard." + dashboardService.currentView);
            dashboardService.setTitle("All");
        }, function(err){
            console.log(err);
            if(!err.data)
                $scope.error = err.message;
            else $scope.error = err.data.message;
        });
    }
}]);
