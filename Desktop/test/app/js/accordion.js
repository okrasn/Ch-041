angular.module('accordion', ['ngAnimate', 'ui.bootstrap'])
    .controller('AccordionCtrl', function ($scope,$http,transfer,$stateParams) {
        $scope.oneAtATime = true;
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        $scope.groupsData = [];
        $scope.dayData = [];

        $http.get('data/custom.json').then(function(response){
            var length = response.data.groups.length;
            for(var i = 0; i < length;i++){
                $scope.groupsData.push(response.data.groups[i]);
            }
        },function(response){
            alert('Error can\'t load data');
        });

    });
