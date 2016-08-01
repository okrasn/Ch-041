angular.module('add_ctrl')
    .controller('AddCtrl',['$scope','add_feed_service',function($scope,add_feed_service){
        $scope.feeds = [];
        $scope.addFeed = function(){
            console.log('add ctrl')
        };
    }]);
