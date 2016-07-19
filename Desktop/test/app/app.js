angular.module('schedule',['service','service.count','datepicker','accordion','ui.router'])
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
    });

