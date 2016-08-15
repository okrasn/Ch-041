(function() {
    'use strict';
    angular.module('rssreader').config(['$validatorProvider', function($validatorProvider) {
        $validatorProvider.addMethod("pattern", function(value, element) {
            return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{6,20}/.test(value);
        }, "");
    }]).
    controller('AuthController', ['$scope', '$state', 'authService', '$window', 'dashboardService', function($scope, $state, authService, $window, dashboardService) {
        $scope.user = {};
        $scope.session;

        var ERRORS = {
            field_required: 'This field is required',
            email_example: 'Please, use example: jacksparrow@gmail.com',
            min_6symbl: 'Please, enter at least 6 characters',
            min_9symbl: 'Please, enter at least 9 characters',
            max_20symbl: 'Please, enter no more then 20 characters',
            reg_exp: '1 of each symbls (a-z,A-Z,0-9,!@#)'
        }

        $scope.register = function(form) {
            if (form.validate()) {
                authService.register($scope.user).error(function(error) {
                    $scope.error = error;
                }).then(function() {
                    $state.go('dashboard.' + dashboardService.currentView, {
                        id: authService.userID()
                    });
                });
            }
        };

        $scope.logIn = function(form) {
            if (form.validate()) {
                authService.logIn($scope.user, $scope.session).error(function(error) {
                    $scope.error = error;
                }).then(function() {
                    if (!$scope.session) {
                        $scope.onExit = function() {
                            auth.logOut();
                        };
                        $state.go('dashboard.' + dashboardService.currentView, {
                            id: authService.userID()
                        });
                        $window.onbeforeunload = $scope.onExit;
                    } else {
                        $state.go('dashboard.' + dashboardService.currentView, {
                            id: authService.userID()
                        });
                    }
                });
            }
        };

        $scope.validationLoginOptions = {
            rules: {
                mail: {
                    required: true,
                    email: true
                },
                pwd: {
                    required: true
                }
            },
            messages: {
                mail: {
                    required: ERRORS.field_required,
                    email: ERRORS.email_example
                },

                pwd: {
                    required: ERRORS.field_required
                }
            }
        };

        $scope.validationRegistrOptions = {
            rules: {
                mail: {
                    required: true,
                    email: true,
                    minlength: 9,
                    maxlength: 20,
                },
                pwd: {
                    required: true,
                    minlength: 6,
                    maxlength: 20,
                    pattern: true
                },
                reppwd: {
                    required: true
                }
            },
            messages: {
                mail: {
                    required: ERRORS.field_required,
                    email: ERRORS.email_example,
                    minlength: ERRORS.min_9symbl,
                    maxlength: ERRORS.max_20symbl
                },

                pwd: {
                    required: ERRORS.field_required,
                    minlength: ERRORS.min_6symbl,
                    maxlength: ERRORS.max_20symbl,
                    pattern: ERRORS.reg_exp
                },

                reppwd: {
                    required: ERRORS.field_required
                }
            }
        }
    }]).directive('checkStrength', function() {

        return {
            replace: false,
            restrict: 'EACM',
            link: function(scope, iElement, iAttrs) {

                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    mesureStrength: function(p) {

                        var _force = 0;
                        var _regex = /[#@$-/:-?-~!"^_`]/g;

                        var _lowerLetters = /[a-z]+/.test(p);
                        var _upperLetters = /[A-Z]+/.test(p);
                        var _numbers = /[0-9]+/.test(p);
                        var _symbols = _regex.test(p);

                        var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                        var _passedMatches = $.grep(_flags, function(el) {
                            return el === true; }).length;

                        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                        _force += _passedMatches * 10;

                        // penality (short password)
                        _force = (p.length <= 5) ? Math.min(_force, 10) : _force;

                        // penality (poor variety of characters)
                        _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                        _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                        _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                        return _force;

                    },
                    getColor: function(s) {

                        var idx = 0;
                        if (s <= 10) { idx = 0; } else if (s <= 20) { idx = 1; } else if (s <= 30) { idx = 2; } else if (s <= 40) { idx = 3; } else { idx = 4; }

                        return { idx: idx + 1, col: this.colors[idx] };

                    }
                };

                scope.$watch(iAttrs.checkStrength, function() {
                    if (scope.user.password === '') {
                        iElement.css({ "display": "none" });
                    } else {
                        var c = strength.getColor(strength.mesureStrength(scope.user.password));
                        iElement.css({ "display": "block" });
                        iElement.children('li')
                            .css({ "background": "#DDD" })
                            .slice(0, c.idx)
                            .css({ "background": c.col });
                    }
                });

            },
            template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
        };

    });
})();
