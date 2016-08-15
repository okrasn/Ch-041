(function () {
    'use strict';
    angular.module('rssreader').factory('authService', ['$http', '$window', function ($http, $window) {
        var auth = {
            saveToken: function (token) {
                $window.localStorage['rss-reader-token'] = token;
            },
            getToken: function () {
                return $window.localStorage['rss-reader-token'];
            },
            isLoggedIn: function () {
                var token = auth.getToken();
                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            },
            currentUser: function () {
                if (auth.isLoggedIn()) {
                    var token = auth.getToken();
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    return payload.email;
                }
            },
            userID: function () {
                if (auth.isLoggedIn()) {
                    var token = auth.getToken();
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    return payload._id;
                }
            },
            register: function (user) {
                return $http.post('/register', user).success(function (data) {
                    auth.saveToken(data.token);
                }).error(function (err) {
                    console.log(err.message);
                });
            },
            logIn: function (user) {
                return $http.post('/login', user).success(function (data) {
                    auth.saveToken(data.token);
                }).error(function (err) {
                    console.log(err.message);
                });
            },
            logOut: function () {
                $window.localStorage.removeItem('rss-reader-token');
            }
        }
        return auth;
}]);
})();