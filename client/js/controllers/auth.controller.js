angular.module('rssreader').config(['$validatorProvider', function ($validatorProvider) {
        $validatorProvider.addMethod("pattern", function (value, element) {
            return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{6,20}/.test(value);
        }, "Please specify the correct domain for your documents");
    }]).
controller('AuthController', ['$scope', '$state', 'authService', '$window', 'dashboardService', function ($scope, $state, authService, $window, dashboardService) {
    $scope.user = {};
    $scope.session;

    var ERRORS = {
        field_required: 'This field is required',
        email_example: 'Please, use example: jacksparrow@gmail.com',
        min_6symbl: 'Please, enter at least 6 characters',
        min_9symbl: 'Please, enter at least 9 characters',
        max_20symbl: 'Please, enter no more then 20 characters',
        reg_exp: 'Requirements: minimum 1 of each chars (a-z,A-Z,0-9,!@#...)'
    }

    $scope.register = function (form) {
        if (form.validate()) {
            authService.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('dashboard.' + dashboardService.currentView, {
                    id: authService.userID()
                });
            });
        }
    };

    $scope.logIn = function (form) {
        if (form.validate()) {
            authService.logIn($scope.user, $scope.session).error(function (error) {
                $scope.error = error;
            }).then(function () {
                if (!$scope.session) {
                    //                    console.log("Not checked");
                    $scope.onExit = function () {
                        auth.logOut();
                    };
                    $state.go('dashboard.' + dashboardService.currentView, {
                        id: authService.userID()
                    });
                    $window.onbeforeunload = $scope.onExit;
                } else{
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
}]).directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            if(elem.val() === "") {
                return;
            }
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }]);