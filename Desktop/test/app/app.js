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



