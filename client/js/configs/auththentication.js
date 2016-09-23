(function () {
	'use strict';
	angular.module('rssreader')
		.config(['$authProvider', '$httpProvider', function ($authProvider, $httpProvider) {
		    $httpProvider.interceptors.push('sessionInjector');

			$authProvider.twitter({
				clientId: '768721225971560448',
				url: '/auth/twitter',
				authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
				redirectUri: window.location.origin,
				oauthType: '1.0',
				popupOptions: {
					width: 495,
					height: 645
				}
			});
			$authProvider.linkedin({
				clientId: '78ffzenowt180q',
				url: '/auth/linkedin',
				authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
				redirectUri: window.location.origin,
				requiredUrlParams: ['state'],
				scopeDelimiter: ' ',
				state: 'STATE',
				oauthType: '2.0',
				popupOptions: { width: 527, height: 582 }
			});
			$authProvider.facebook({
				clientId: '173686319709284',
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
		}]);
})();