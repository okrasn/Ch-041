angular.module('schedule',['datepicker' ,'accordion','ui.router'])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/groups');
        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl:'partials/groups.html',
                controller : 'AccordionCtrl'
            })
            .state('groups.groupsCalendar', {
                url: '/groupsCalendar/:groupsCalendarID/',
                templateUrl: 'partials/groups.calendar.html',
                controller : 'AccordionCtrl'
            })
            .state('groups.groupsCalendar.table', {
                url: '/table/:tableID',
                templateUrl: 'partials/table.html',
                controller : 'AccordionCtrl'
        })
    })
    .controller('TableCtrl',['$scope','$http','transfer',function($scope,$http,transfer){
        $scope.data = [];
        $scope.groups = transfer.getData();
        $http.get('data/custom.json').then(function(response){
            console.log(response.data);
            var length = response.data.groups.length;
            for(var i = 0;i < length; i++){
                $scope.data.push(response.data.groups[i]);
            }
        },function(response){
            alert('Error no response');
        })
    }])
    .factory('transfer',[function(){
        var transferData = [];
        function setData(data){
            transferData.push(data);
        }
        function getData(){
            return transferData;
        }
        return{
            setData : setData,
            getData : getData
        }
    }]);



