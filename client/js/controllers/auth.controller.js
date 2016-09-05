(function() {
	
	angular.module('rssreader').config(['$validatorProvider', function($validatorProvider) {
		$validatorProvider.addMethod("pattern", function(value, element) {
			return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{6,20}/.test(value);
		}, "Password must contain(a-z,A-Z,0-9,!@#)");
	}]).
	controller('AuthController', ['$scope', '$state', 'authService', 'profileService', '$window', 'dashboardService', '$auth', 'transfer', 'jwtHelper', 'toasterService', function ($scope, $state, authService, profileService, $window,  dashboardService, $auth, transfer, jwtHelper, toasterService) {
		$scope.user = {};
		$scope.test = 5;
		$scope.session;

		var ERRORS = {
			field_required: 'This field is required',
			email_example: 'Please, use example: jacksparrow@gmail.com',
			min_6symbl: 'Please, enter at least 6 characters',
			min_9symbl: 'Please, enter at least 9 characters',
			max_20symbl: 'Please, enter no more then 40 characters',
			reg_exp: 'Password must contain(a-z,A-Z,0-9,!@#)'
		}

		$scope.register = function (form) {
			if (form.validate()) {
				authService.register($scope.user).error(function (error) {
					$scope.error = error;
				}).then(function (response) {
					console.log(response);
					toasterService.success('You have successfully registered');
					$state.go('dashboard.' + dashboardService.getViewMode(), {
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
						$scope.onExit = function () {
							auth.logOut();
						};
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
						toasterService.success('You have successfully login');
						$window.onbeforeunload = $scope.onExit;
					} else {
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
						toasterService.success('You have successfully login');
					}
				});
			}
		};

		$scope.authenticate = function (provider) {
			$auth.authenticate(provider).then(function (response) {
				authService.saveToken(response.data.token);
				toasterService.success('You have successfully authenticated');
				$state.go('dashboard.' + dashboardService.getViewMode(), {
					id: authService.userID()
				});
			})
		}

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
					maxlength: 40,
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
	}]);
})();