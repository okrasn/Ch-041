angular.module('accordion', ['ngAnimate', 'ui.bootstrap'])
    .controller('AccordionCtrl', function ($scope,$http,transfer) {
        $scope.oneAtATime = true;
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        $scope.test = 2;
        transfer.callback().then(function(response){
            $scope.groupsData = response;
        });
    });

