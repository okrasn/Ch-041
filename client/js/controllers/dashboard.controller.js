angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', function ($scope, $state, dashboardService) {
    $state.title = dashboardService.title;
}]);