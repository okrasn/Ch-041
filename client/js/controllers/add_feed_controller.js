angular.module('add_ctrl',[])
    .controller('AddCtrl',['$scope','$state','add_feed_service',function($scope,$state,add_feed_service){
        //$scope.feeds = [];
        $scope.addFeed = function(){
            add_feed_service.setUrl($scope.url);
            add_feed_service.getFeeds().then(function(response){
                $scope.feeds = response;
                console.log($scope.feeds);
            });
            //add_feed_service.setArray($scope.feeds);
            //$state.go('home');
        };

    }]);
