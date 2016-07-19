angular.module('accordion', ['ngAnimate', 'ui.bootstrap'])
    .controller('AccordionCtrl', function ($scope,$http,transfer,count_service) {
        $scope.oneAtATime = true;
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        //$scope.counter = 0;
         $scope.passingData = function(){
            count_service.setData($scope.search_subject);
            console.log('ok');    
            console.log($scope.element.days);
            $scope.subject = count_service.getData();
            var counter = 0;
            for(var i = 0; i < $scope.element.days.length;i++){
               for(var j = 0; j < $scope.element.days[i].subject.length;j++){
                    if($scope.subject.toLowerCase() === $scope.element.days[i].subject[j].subject){
                        counter++;
                    }
                }
            }
            $scope.counter = counter;
        }
        $scope.test = 2;
        transfer.callback().then(function(response){
            $scope.groupsData = response;
        });
    });

