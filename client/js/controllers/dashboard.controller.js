(function () {
    'use strict';
    angular.module('rssreader').controller('DashboardController', ['$scope', '$state', '$timeout', 'dashboardService', 'feedsService', function ($scope, $state, $timeout, dashboardService, feedsService) {
        if (feedsService.feedsDictionary.length) {
            dashboardService.setTitle("All");
            $state.go('dashboard.' + dashboardService.getViewMode());
        } else {
            dashboardService.setTitle("Add Feed");
            $state.go('dashboard.addFeed');
        }
        $scope.sidebar = dashboardService.checkSidebar;
        $scope.toggleSidebar = function () {
            dashboardService.sidebar = !dashboardService.sidebar;
        }
        $scope.toasterShown = false;
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
            $scope.toasterShown = !$scope.toasterShown;
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $scope.toasterShown = false;
            }, 5000);
        }
        $scope.confirmFeedDelete = function () {
            feedsService.removeFeed(dashboardService.getFeedId())
                .then(function (res) {
                    $state.reload("dashboard");
                }, function (err) {
                    console.log(err);
                });
        }

        $scope.$watch('alertMsg', function (newVal) {
            if (newVal && newVal.length) {
                $timeout(function () {
                    $scope.alertMsg = null;
                }, 4000);
            }
        });
        $scope.$watch('successMsg', function (newVal) {
            if (newVal && newVal.length) {
                $timeout(function () {
                    $scope.successMsg = null;
                }, 4000);
            }
        });
    }]);
})();