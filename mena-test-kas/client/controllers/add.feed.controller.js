angular.module('add.ctrl',[])
    .controller('AddCtrl',['add.feed.service','$scope',function($scope,add.feed.service){
        $scope.feeds = [];
        $scope.addFeed = function(){
            var test = 'text';
            $scope.feeds.push(test);
            
        };

    }]);
