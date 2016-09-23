(function () {
	'use strict';
	angular.module('rssreader', ['ui.router', 'ngAnimate', 'ngValidate', 'ngFileUpload', 'ngTouch', 'favicon', 'dndLists', 'satellizer', 'angular-jwt', '720kb.socialshare', 'ui.bootstrap', 'angular-scroll-animate'])
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('home');
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: './partials/home.html',
					controller: 'HomeController'
				})
				.state('404', {
					url: '/not-found',
					templateUrl: './partials/static/404_page.html',
					controller: ['$scope', function ($state) {
					}]
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
				.state('forgot', {
					url: '/forgot',
					templateUrl: './partials/auth/forgot.html',
					controller: 'AuthController'
				})
				.state('reset', {
					url: '/reset/:token/:email',
					templateUrl: './partials/auth/reset.html',
					controller: 'AuthController',
					onEnter : ['$stateParams', 'transfer', function ($stateParams, transfer) {
						transfer.setObj($stateParams.token);
						transfer.setEmail($stateParams.email);	
					}]
				})
				.state('verify', {
					url: '/verify/:token/:email',
					templateUrl: './partials/auth/verify.html',
					controller: 'AuthController',
					onEnter : ['$stateParams', 'transfer', 'toasterService', function ($stateParams, transfer, toasterService) {
						transfer.setEmail($stateParams.email);
						transfer.setString($stateParams.token);
						toasterService.info('You have successfuly approved you email. Please reenter you fields');
					}]
				})
				.state('profile', {
					url: '/profile',
					templateUrl: './partials/auth/profile.html',
					controller: 'ProfileController',
					resolve: {
						profilePromise: ['profileService', function(profileService){
							return profileService.getProfile();
						}]
					},
					onEnter: ['$state', 'authService', function ($state, authService) {
						if (!authService.isLoggedIn()) {
							authService.logOut();
							$state.go('home');
						}
					}]
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
						profilePromise: ['profileService', function(profileService){
							return profileService.getProfile();
						}],
						feedPromise: ['feedsService', function (feedsService) {
							return feedsService.getAllFeeds();
						}]
					}
				})
				.state("dashboard.list", {
				    url: '/list/?type&value1&value2',
					templateUrl: './partials/list/list.html',
					controller: 'ArticlesController'
				})
				.state("dashboard.th-list", {
				    url: '/th-list/?type&value1&value2',
					templateUrl: './partials/list/th-list.html',
					controller: 'ArticlesController'
				})
				.state("dashboard.th-large", {
				    url: '/th-large/?type&value1&value2',
					templateUrl: './partials/list/th-large.html',
					controller: 'ArticlesController'
				})
				.state("dashboard.addFeed", {
					url: '/add',
					templateUrl: './partials/dashboard/add-feed.html',
					controller: 'FeedsController',
					onEnter: ['dashboardService', function (dashboardService) {
						dashboardService.setTitle("Add Feed");
					}],
					resolve: {
						feedPromise: ['feedsService', function (feedsService) {
							return feedsService.getAdvicedFeeds();
						}]
					}
				})
				.state("dashboard.adviced", {
					url: '/adviced/:category',
					templateUrl: './partials/dashboard/adviced.html',
					controller: 'FeedsController',
					resolve: {
					    feedPromise: ['feedsService', 'articlesService', '$stateParams', function (feedsService, articlesService, $stateParams) {
					        return feedsService.getAdvicedFeeds().then(function (res) {
					            return articlesService.getAdvicedArticlesByCat($stateParams.category);
					        })
						}]
					}
				})
				.state("dashboard.article", {
					url: '/article/?feed&link&type',
					templateUrl: './partials/dashboard/article.html',
					controller: 'ArticlesController',
					resolve: {
						articlePromise: ['articlesService', function (articlesService) {
							return articlesService.getAdvicedArticles();
						}]
					}
				})
				.state("dashboard.profile", {
					url: '/profile',
					templateUrl: './partials/auth/profile.html',
					controller: 'ProfileController',
					resolve: {
						profilePromise: ['profileService', function (profileService) {
							return profileService.getProfile();
						}]
					},
					onEnter: ['$state', 'authService', function ($state, authService) {
						if (!authService.isLoggedIn()) {
							authService.logOut();
							$state.go('home');
						}
					}]
				});
	}]);
})();