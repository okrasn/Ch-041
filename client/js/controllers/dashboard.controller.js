angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', 'feedsService', function ($scope, $state, dashboardService, feedsService) {
    $scope.headTitle = dashboardService.getTitle;
    $scope.feed = dashboardService.getFeedId;
    
    $scope.onViewChange = function(view){
        dashboardService.currentView = view;
        $state.go('dashboard.' + dashboardService.currentView);
    }
    
    $scope.onFeedDelete = function(){
        feedsService.removeFeed(dashboardService.currentFeed);
        $state.reload();
    }
}]);