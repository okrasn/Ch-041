angular.module('rssreader', ['ui.router', 'ngValidate','auth0', 'angular-storage', 'angular-jwt']).config(['$stateProvider', '$urlRouterProvider','$httpProvider','authProvider','jwtInterceptorProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, authProvider,jwtInterceptorProvider) {
    
authProvider.on('loginSuccess', ['$location', 'profilePromise', 'idToken', 'store',
    function($location, profilePromise, idToken, store) {
        console.log("Login Success");
	profilePromise.then(function(profile) {
	store.set('profile', profile);
	store.set('token', idToken);
        console.log(profile);
        console.log(idToken);
        $location.path('/dashboard');
    });
  
    
}]);


	authProvider.on('loginFailure', function() {
  		console.log("Error logging in");
  		$location.path('http://localhost:8080/#/login');
	});
	
	authProvider.init({
    	domain: 'kasjs.eu.auth0.com',
    	clientID: '67EH9djYM9SB4AnOnjO1e8A8o3zyrHS1',
    	loginUrl: 'http://localhost:8080/#/dashboard'
	});

	
	
	
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
        .state("dashboard.th-large", {
            url: '/th-large',
            templateUrl: './partials/list/th-large.html',
            controller: 'ArticlesController',
            resolve: {
                articlesPromise: ['articlesService', function (articlesService) {
                    return articlesService.getAllArticles();
                }]
            }
        })
        .state("dashboard.list", {
            url: '/list',
            templateUrl: './partials/list/list.html',
            controller: 'ArticlesController',
            resolve: {
                articlesPromise: ['articlesService', function (articlesService) {
                    return articlesService.getAllArticles();
                }]
            }
        })
        .state("dashboard.th-list", {
            url: '/th-list',
            templateUrl: './partials/list/th-list.html',
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
	
	jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    return store.get('token');
}]

$httpProvider.interceptors.push('jwtInterceptor');
	
}])
.run(['$rootScope','auth','store','jwtHelper','$location',function($rootScope, auth, store, jwtHelper, $location) {
	
$rootScope.$on('$locationChangeStart', function() {

    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        $location.path('/login');
      }
    }

  });
}])
