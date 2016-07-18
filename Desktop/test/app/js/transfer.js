angular.module('service',[])
    .factory('transfer',['$http',function($http){
        return {
        callback : function() {
            return $http.get('data/custom.json').then(function(response){
                var groupsData = [];
                var length = response.data.groups.length;
                for(var i = 0; i < length;i++){
                    groupsData.push(response.data.groups[i]);
                }
                return groupsData;
            },function(response){
                alert('Error can\'t load data');
            });
        }
    };
}]);

