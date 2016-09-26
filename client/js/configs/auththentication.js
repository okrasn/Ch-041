(function () {
	'use strict';
	angular.module('rssreader')
		.config(['$authProvider', '$httpProvider', function ($authProvider, $httpProvider) {
		    $httpProvider.interceptors.push('sessionInjector');
		}]);
})();