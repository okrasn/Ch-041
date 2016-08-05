angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', function ($scope, $state, dashboardService) {
    $scope.headTitle = dashboardService.getTitle;
    
    $scope.onViewChange = function(view){
        dashboardService.currentView = view;
        $state.go('dashboard.' + dashboardService.currentView);
    }
}]);