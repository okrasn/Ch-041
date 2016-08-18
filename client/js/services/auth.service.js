(function () {
'use strict';
    angular.module('rssreader').factory('authService', ['$http', '$window', '$auth','transfer', 'jwtHelper', function ($http, $window, $auth, transfer, jwtHelper) {
        var auth = {
            saveToken: function (token) {
                $auth.setToken(token);
            },
            getToken: function () {
                return $auth.getToken();
            },
            isLoggedIn: function () {
                var token = auth.getToken();
                if (token) {
                    var payload = $auth.getPayload();
                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            },
            currentUser: function () {
                if (auth.isLoggedIn()) {
                	return transfer.getObj().email;
				}
            },
            userID: function () {
                if (auth.isLoggedIn()) {
            		var payload = $auth.getPayload();
					console.log(payload);
            		return payload.sub;
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
                $auth.removeToken();
        		$auth.logout();
            }
        }
        return auth;
	}]);
})();