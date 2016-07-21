angular.module('accordion', ['ngAnimate', 'ui.bootstrap'])
    .controller('AccordionCtrl', ['$scope','$http','transfer','count_service',function ($scope,$http,transfer,count_service) {
        $scope.oneAtATime = true;
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        //$scope.counter = 0;
        $scope.passingData = function(){
            count_service.setData($scope.selected_value);
            count_service.setArrayObjects($scope.element.days);
            $scope.subject = count_service.getData();
            $scope.counter = count_service.counter();
            $scope.search_subject = '';
        };
        transfer.callback().then(function(response){
            $scope.groupsData = response;
        });
    }]);

