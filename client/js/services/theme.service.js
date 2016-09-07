(function() {
    'use strict';
    angular.module('rssreader').factory('themeService', ['$http', 'authService', '$window',
        function($http, authService, $window) {
            var thm = {
                layout: 'theme1',
                getTheme: function() {
                    return thm.layout !== undefined ? thm.layout : "theme1";
                },
                layouts: [{
                    name: 'Blue',
                    url: 'theme1'
                }, {
                    name: 'Black',
                    url: 'theme2'
                }, {
                    name: 'Grey',
                    url: 'theme3'
                }],
                changeTheme: function(theme) {
                    return $http.post('/users/' + authService.userID() + '/changeColorTheme', {
                        colorTheme: theme
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken()
                        }
                    });
                }
            }
            return thm;
        }
    ]);
})();