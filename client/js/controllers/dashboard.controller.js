(function () {
    'use strict';
    angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', 'feedsService', 'toasterService', function ($scope, $state, dashboardService, feedsService, toasterService) {
        if (feedsService.feedsDictionary.length) {
            dashboardService.setTitle("All");
            $state.go('dashboard.' + dashboardService.getViewMode());
        } else {
            dashboardService.setTitle("Add Feed");
            $state.go('dashboard.addFeed');
        }
        $scope.loadingIcon = dashboardService.isLoading;
        $scope.sidebar = dashboardService.checkSidebar;
        $scope.toggleSidebar = function () {
            dashboardService.sidebar = !dashboardService.sidebar;
        }

        $scope.headTitle = dashboardService.getTitle;
        $scope.feed = dashboardService.getFeedId;
        $scope.alertMsg = dashboardService.alertMsg;
        $scope.successMsg = dashboardService.successMsg;

        $scope.hideViewBtns = function () {
            if ($scope.headTitle() === "Add Feed" || feedsService.feedsDictionary.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        $scope.checkIfToggled = function (mode) {
            return dashboardService.getViewMode() === mode;
        }
        $scope.onViewChange = function (view) {
            switch (view) {
                case 'view-mode1':
                    dashboardService.setViewMode(0);
                    break;
                case 'view-mode2':
                    dashboardService.setViewMode(1);
                    break;
                case 'view-mode3':
                    dashboardService.setViewMode(2);
                    break;
            }
            $state.go('dashboard.' + dashboardService.getViewMode());
        }
        var timer;
        $scope.onFeedDelete = function () {
            toasterService.confirm({
                message: "Remove this feed?",
                confirm: "confirmFeedDelete"
            }, $scope);
        }
        $scope.confirmFeedDelete = function () {
            feedsService.removeFeed(dashboardService.getFeedId())
                .then(function (res) {
                    toasterService.info("Feed has been deleted");
                    $state.reload("dashboard");
                }, function (err) {
                    console.log(err);
                });
        }
    }]);
})();