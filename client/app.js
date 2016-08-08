angular.module('auth', ['ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'satellizer'])
	.config(function ($stateProvider, $urlRouterProvider, $authProvider) {

		var skipIfLoggedIn = function ($q, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.reject();
			} else {
				deferred.resolve();
			}
			return deferred.promise;
		};

		var loginRequired = function ($q, $location, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.resolve();
			} else {
				$location.path('/login');
			}
			return deferred.promise;
		};

		/**
		 * App routes
		 */
		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeCtrl',
				templateUrl: 'partials/home.html'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'partials/login.html',
				controller: 'LoginCtrl',
				resolve: {
					skipIfLoggedIn: skipIfLoggedIn
				}
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'partials/signup.html',
				controller: 'SignupCtrl',
				resolve: {
					skipIfLoggedIn: skipIfLoggedIn
				}
			})
			.state('logout', {
				url: '/logout',
				template: null,
				controller: 'LogoutCtrl'
			})
			.state('profile', {
				url: '/profile',
				templateUrl: 'partials/profile.html',
				controller: 'ProfileCtrl',
				resolve: {
					loginRequired: loginRequired
				}
			});
		$urlRouterProvider.otherwise('/');

		$authProvider.facebook({
			clientId: '174625396282043',
			name: 'facebook',
			url: '/auth/facebook',
			authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
			redirectUri: window.location.origin + '/',
			requiredUrlParams: ['display', 'scope'],
			scope: ['email'],
			scopeDelimiter: ',',
			display: 'popup',
			oauthType: '2.0',
			popupOptions: {
				width: 580,
				height: 400
			}
		});

		// Google
		$authProvider.google({
			clientId: '806677097865-va2i3kq96mmu8i00t9k6q92ks1s9tg0l.apps.googleusercontent.com',
			url: '/auth/google',
			authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
			redirectUri: window.location.origin,
			requiredUrlParams: ['scope'],
			optionalUrlParams: ['display'],
			scope: ['profile', 'email'],
			scopePrefix: 'openid',
			scopeDelimiter: ' ',
			display: 'popup',
			oauthType: '2.0',
			popupOptions: {
				width: 452,
				height: 633
			}
		});
		// LinkedIn
		$authProvider.linkedin({
			url: '/auth/linkedin',
			authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
			redirectUri: window.location.origin,
			requiredUrlParams: ['state'],
			scope: ['r_emailaddress'],
			scopeDelimiter: ' ',
			state: 'STATE',
			oauthType: '2.0',
			popupOptions: {
				width: 527,
				height: 582
			}
		});

		// Twitter
		$authProvider.twitter({
			url: '/auth/twitter',
			authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
			redirectUri: window.location.origin,
			oauthType: '1.0',
			popupOptions: {
				width: 495,
				height: 645
			}
		});



	});


/*
	$authProvider.linkedin({
      clientId: 'YOUR_LINKEDIN_CLIENT_ID'
    });
	$authProvider.twitter({
      url: '/auth/twitter'
    });
*/
