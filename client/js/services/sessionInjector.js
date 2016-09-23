(function () {
    'use strict';
    angular.module('rssreader').factory('sessionInjector', ['$injector', function ($injector) {
        var sessionInjector = {
            request: function (config) {
                var auth = $injector.get('authService');
                if (!auth.isLoggedIn()) {
                    config.headers['Authorization'] = 'Bearer ' + auth.getToken();
                }
                return config;
            }
        };
        return sessionInjector;
    }]);
})();