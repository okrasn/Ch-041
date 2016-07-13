angular.module('schedule',['tuls','ui.router'])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/groups');
        $stateProvider
            .state('groups',{
                url : '/groups',
                templateUrl : 'partials/groups.html',
                controller : 'AccordionCtrl'
        	})
            .state('groups.group-calendar-1',{
                url : '/groups',
                templateUrl : 'partials/group-calendar-1.html',
                controller : 'AccordionCtrl'
            })
            .state('groups.group-calendar-1',{
                url : '/groups',
                templateUrl : 'partials/group-calendar-1.html',
                controller : 'AccordionCtrl'
            })
            .state('groups.group-calendar-1',{
                url : '/groups',
                templateUrl : 'partials/group-calendar-1.html',
                controller : 'AccordionCtrl'
            })

        	
    })
    .controller('TableCtrl',['$scope',function($scope){
    	
    }])
    .factory('transfer', function($http){
        var data = [];
        $http.get('data/custom.json').then(function(response){
            console.log(response.data.groups);
            data.push(response.data.groups);
        })
        function setData(data){
            date.push(data);
        }

        function getData(data){
            return data;
        }
        console.log(data);
        return {
            setData : setData,
            getData : getData
        }
    });
