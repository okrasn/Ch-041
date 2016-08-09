angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', 'feedsService', function ($scope, $state, dashboardService, feedsService) {
    $scope.headTitle = dashboardService.getTitle;
    $scope.feed = dashboardService.getFeedId;

    $scope.toggle1 = false;
    $scope.toggle2 = false;
    $scope.toggle3 = true;

    $scope.hideViewBtns = function () {
        if ($scope.headTitle() === "Add Feed" || feedsService.getDictionary().length == 0) {
            return true;
        } else {
            return false;
        }
    }
    $scope.onViewChange = function ($event, view) {
        switch ($event.currentTarget.id) {
            case 'viewBtnOne':
                $scope.toggle1 = true;
                $scope.toggle2 = false;
                $scope.toggle3 = false;
                break;
            case 'viewBtnTwo':
                $scope.toggle1 = false;
                $scope.toggle2 = true;
                $scope.toggle3 = false;
                break;
            case 'viewBtnThree':
                $scope.toggle1 = false;
                $scope.toggle2 = false;
                $scope.toggle3 = true;
                break;
        }

        dashboardService.currentView = view;
        $state.go('dashboard.' + dashboardService.currentView);
    }
    $scope.onFeedDelete = function () {
        feedsService.removeFeed(dashboardService.getFeedId())
            .then(function (res) {
                $state.reload("dashboard");
                //$state.go("dashboard." + dashboardService.currentView);
            }, function (err) {
                console.log(err);
            });
    }
}]);