angular.module('rssreader', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: './partials/home.html',
            controller: 'HomeController'
        })
        .state('login', {
            url: '/login',
            templateUrl: './partials/auth/login.html',
            controller: 'AuthController'
        })
        .state('register', {
            url: '/register',
            templateUrl: './partials/auth/register.html',
            controller: 'AuthController'
        })
        .state("dashboard", {
            url: '/dashboard/:id',
            templateUrl: './partials/dashboard.html',
            controller: 'DashboardController'
        })
        .state("dashboard.addFeed", {
            url: '/addFeed',
            templateUrl: './partials/addFeed.html',
            controller: 'FeedsController'
        })
        .state("dashboard.feed", {
            url: '/feed',
            templateUrl: './partials/feed.html',
            controller: 'FeedsController',
            resolve: {
                feedPromise: ['$stateParams', 'feedsService', function ($stateParams, feedsService) {
                    return feedsService.get($stateParams.id);
                }]
            }
        });
}]);