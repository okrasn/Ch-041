(function () {
    'use strict';
    angular.module('rssreader').factory('sessionInjector', ['$injector', function ($injector) {
        var sessionInjector = {
            responseError: function (res) {
                var $state = $injector.get('$state'),
                $q = $injector.get('$q'),
                authService = $injector.get('authService');
                if (res.status == 404) {
                    console.log("404");
                    $state.go('404', { reload: true });
                }
                else if (res.status == 403) {
                    authService.logOut();
                    $state.go('home', {reload: true})
                }
                return $q.reject(res);
            }
        };
        return sessionInjector;
    }]);
})();