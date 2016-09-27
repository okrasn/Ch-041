(function () {
    'use strict';
    angular.module('rssreader').factory('sessionInjector', ['authService', function (authService) {
        var sessionInjector = {
            request: function (config) {
                if (authService.isLoggedIn()) {
                    config.headers['Authorization'] = 'Bearer ' + authService.getToken();
                }
                return config;
            }
        };
        return sessionInjector;
    }]);
})();