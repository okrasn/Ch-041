angular.module('rssreader', ['ui.router', 'ngValidate', 'ngFileUpload', 'favicon'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
                controller: 'AuthController',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('loginAuth', {
                url: '/loginAuth',
                templateUrl: 'partials/auth/loginAuth.html',
                controller: 'AuthController'
            })
            .state('logoutAuth', {
                url: '/logoutAuth',
                templateUrl: 'partials/auth/logoutAuth.html',
                controller: 'AuthController'
            })
            .state('register', {
                url: '/register',
                templateUrl: './partials/auth/register.html',
                controller: 'AuthController',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
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
                    },
                    'feedHead@dashboard': {
                        templateUrl: './partials/dashboard/feed-head.html',
                        controller: 'DashboardController'
                    }
                },
                resolve: {
                    feedPromise: ['feedsService', function (feedsService) {
                        return feedsService.getAllFeeds();
                }],
                    articlesPromise: ['articlesService', function (articlesService) {
                        return articlesService.getAllArticles();
                    }]
                },
                onEnter: ['articlesService', function (articlesService) {
                    return articlesService.getAllArticles();
                    }]
            })
            .state("dashboard.th-large", {
                url: '/th-large',
                templateUrl: './partials/list/th-large.html',
                controller: 'ArticlesController'
                    //                resolve: {
                    //                    articlesPromise: ['articlesService', function (articlesService) {
                    //                        return articlesService.getAllArticles();
                    //                }]
                    //                }
            })
            .state("dashboard.list", {
                url: '/list',
                templateUrl: './partials/list/list.html',
                controller: 'ArticlesController'
                    //                resolve: {
                    //                    articlesPromise: ['articlesService', function (articlesService) {
                    //                        return articlesService.getAllArticles();
                    //                }]
                    //                }
            })
            .state("dashboard.th-list", {
                url: '/th-list',
                templateUrl: './partials/list/th-list.html',
                controller: 'ArticlesController'
                    //                resolve: {
                    //                    articlesPromise: ['articlesService', function (articlesService) {
                    //                        return articlesService.getAllArticles();
                    //                }]
                    //                }
            })
            .state("dashboard.addFeed", {
                url: '/add',
                templateUrl: './partials/dashboard/add-feed.html',
                controller: 'FeedsController',
                resolve: {
                    dashboardPromise: ['dashboardService', function (dashboardService) {
                        return dashboardService.setTitle("Add Feed");
                }]
                }
            });
}]);

//
//,
//                resolve: {
//                    articlesPromise: ['articlesService', function (articlesService) {
//                        return articlesService.getAllArticles();
//                }]