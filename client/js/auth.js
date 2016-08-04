//angular.module('rssreader', ['ui.router','auth0', 'angular-storage', 'angular-jwt']).config(['$stateProvider', '$urlRouterProvider','$httpProvider','authProvider','jwtInterceptorProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, authProvider,jwtInterceptorProvider) {
//    
//authProvider.on('loginSuccess', ['$location', 'profilePromise', 'idToken', 'store',
//    function($location, profilePromise, idToken, store) {
//        console.log("Login Success");
//	profilePromise.then(function(profile) {
//	store.set('profile', profile);
//	store.set('token', idToken);
//        console.log(profile);
//        console.log(idToken);
//        $location.path('/dashboard');
//    });
//  
//    
//}]);
//
//
//	authProvider.on('loginFailure', function() {
//  		console.log("Error logging in");
//  		$location.path('http://localhost:8080/#/login');
//	});
//	
//	authProvider.init({
//    	domain: 'kasjs.eu.auth0.com',
//    	clientID: '67EH9djYM9SB4AnOnjO1e8A8o3zyrHS1',
//    	loginUrl: 'http://localhost:8080/#/dashboard'
//	});
//
//	
//	
//	
//	
//	jwtInterceptorProvider.tokenGetter = ['store', function(store) {
//        return store.get('token');
//    }];
//
//    $httpProvider.interceptors.push('jwtInterceptor');
//	
//}])
//  
//.run(['$rootScope','auth','store','jwtHelper','$location',function($rootScope, auth, store, jwtHelper, $location) {
//	
//$rootScope.$on('$locationChangeStart', function() {
//
//    var token = store.get('token');
//    if (token) {
//      if (!jwtHelper.isTokenExpired(token)) {
//        if (!auth.isAuthenticated) {
//          auth.authenticate(store.get('profile'), token);
//        }
//      } else {
//        $location.path('/login');
//      }
//    }
//
//  });
//}])
