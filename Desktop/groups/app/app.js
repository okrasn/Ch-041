angular.module('schedule',['ui.router'])
    .config(function($stateProvider, $urlRouterProvider){


        $stateProvider
            .state('groups',{
                url : '/groups',
                templateUrl : 'partials/groups.html'
            })
            .state('calendar',{
                url: '/calendar',
                template : 'Data picker',
                controller : 'DateCtrl'
            });

        $urlRouterProvider
            .otherwise('groups');
    });

