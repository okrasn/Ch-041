angular.module('rssreader').controller('FeedsController', ['$scope', '$state', 'feedsService', 'dashboardService', function ($scope, $state, feedsService, dashboardService) {
    $scope.test = 'Hello world!';
    $scope.obj = {};
    $scope.feeds = feedsService.feedsDictionary;
    $scope.categories = feedsService.CATEGORIES;  
    $scope.addFeed = function () {
        $scope.error = '';
        feedsService.addFeed($scope.obj).then(function(res){
//            $state.go("dashboard." + dashboardService.currentView);
        }, function(err){
            if(!err.data)
                $scope.error = err.message;
            else $scope.error = err.data.message;
        });
        $state.reload();
    }
}]);
