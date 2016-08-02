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
        .state('profile', {
            url: '/profile',
            templateUrl: './partials/auth/profile.html',
            controller: 'ProfileController'
        })
        .state("dashboard", {
            url: '/dashboard',
            views: {
                '': {
                    templateUrl: './partials/dashboard/dashboard.html',
                    controller: 'DashboardController'
                },
                'sidebar@dashboard': {
                    templateUrl: './partials/dashboard/sidebar.html',
                    controller: 'SidebarController'
                }
            },
            resolve: {
                feedPromise: ['feedsService', function (feedsService) {
                    return feedsService.getAllFeeds();
                }]
            }
        })
        .state("dashboard.fullFeed", {
            url: '/fullFeed',
            templateUrl: './partials/dashboard/full-feed.html',
            controller: 'ArticlesController',
            resolve: {
                articlesPromise: ['articlesService', function (articlesService) {
                    return articlesService.getAllArticles();
                }]
            }
        })
        .state("dashboard.addFeed", {
            url: '/add',
            templateUrl: './partials/dashboard/add-feed.html',
            controller: 'FeedsController'
        });
}]);