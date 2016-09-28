(function () {
    'use strict';
    angular.module('rssreader').factory('sessionInjector', ['$injector', function ($injector) {
        var sessionInjector = {
            responseError: function (res) {
                var $state = $injector.get('$state'),
                $q = $injector.get('$q');
                if (res.status == 404) {
                    $state.go('404', { reload: true });
                }
                return $q.reject(res);
            }
        };
        return sessionInjector;
    }]);
})();