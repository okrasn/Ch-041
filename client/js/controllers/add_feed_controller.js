angular.module('add_ctrl',[])
    .controller('AddCtrl',['$scope','$state','$http','add_feed_service',function($scope,$state,$http,add_feed_service){
        $scope.feeds = [];
        $scope.addFeed = function(){
            add_feed_service.setUrl($scope.url);
            $scope.feeds = add_feed_service.getFeeds();
            console.log($scope.feeds);
            
            //add_feed_service.setArray($scope.feeds);
            $state.go('home');
        };

    }]);
