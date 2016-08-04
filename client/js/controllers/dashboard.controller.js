angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', function ($scope, $state, dashboardService) {
    $scope.headTitle = dashboardService.getTitle;
}]);