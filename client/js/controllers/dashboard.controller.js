angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', 'feedsService', function ($scope, $state, dashboardService, feedsService) {
    $scope.headTitle = dashboardService.getTitle;
    $scope.feed = dashboardService.getFeedId;

    $scope.hideViewBtns = function () {
        if ($scope.headTitle() === "Add Feed" || feedsService.getDictionary().length == 0) {
            return true;
        } else {
            return false;
        }
    }
    $scope.onViewChange = function (view) {
        dashboardService.currentView = view;
        $state.go('dashboard.' + dashboardService.currentView);
    }
    $scope.onFeedDelete = function () {
        feedsService.removeFeed(dashboardService.getFeedId())
            .then(function (res) {
            $state.reload("dashboard");
            $state.go("dashboard." + dashboardService.currentView);
        });
    }
}]);