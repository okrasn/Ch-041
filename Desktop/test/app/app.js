angular.module('schedule',['tuls'])
    .config(function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/groups');
        $stateProvider
            .state('groups',{
                url : '/groups',
                templateUrl : 'partials/groups.html',
                controller : 'AccordionDemoCtrl'
        })
    })
