angular.module('rssreader').controller('AuthController', ['$scope', '$state', 'authService', '$window','auth','store','$location', function ($scope, $state, authService, $window,auth,store,$location) {
    $scope.user = {};
    $scope.session;
	//Authorization
	$scope.auth = auth;
	console.log(auth);
	$scope.logout = function() {
  		auth.signout();
  		store.remove('profile');
  		store.remove('token');
  		$location.path('/login');
	}


    $scope.register = function (form) {
        console.log($scope.user);
        if (form.validate()) {
            authService.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('dashboard.th-large');
            });
        }
    };

    $scope.logIn = function (form) {
        if (form.validate()) {
            authService.logIn($scope.user, $scope.session).error(function (error) {
                $scope.error = error;
            }).then(function () {
                if (!$scope.session) {
                    console.log("Not checked");
                    $scope.onExit = function () {
                        auth.logOut();
                    };
                    $window.onbeforeunload = $scope.onExit;
                } else
                    console.log("Checked");

                $state.go('dashboard.th-large', {
                    id: authService.userID()
                });
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
                required: "This field is required ",
                email: ""
            },

            pwd: {
                required: "This field is required "
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
            },
            reppwd: {
                required: true,
                minlength: 6,
                maxlength: 20,
            }
        },
        messages: {
            mail: {
                required: "This field is required ",
                email: "Please, use example: jacksparrow@gmail.com ",
                minlength: "Please, enter at least 9 characters ",
                maxlength: "Please, enter no more than 20 characters. "
            },

            pwd: {
                required: "This field is required ",
                minlength: "Please, enter at least 6 characters ",
                maxlength: "Please, enter no more than 20 characters. "
            },

            reppwd: {
                required: "This field is required ",
                minlength: "Please, enter at least 6 characters ",
                maxlength: "Please, enter no more than 20 characters. "
            }
        }
    }
}]);