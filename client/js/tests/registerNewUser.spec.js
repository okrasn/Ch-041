describe('authService and AuthController', function () {
	var $controller, authService, $q, $httpBackend,
		user = {
			email: "test222@gmail.com",
			password: "123456789aA!",
			repPassword: "123456789aA!"
		},
		response_success =
		"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2MzM2YzOWMxMTE1MjA0MTJmMGJlZWUiLCJlbWFpbCI6InRlc3QyMjJAZ21haWwuY3BtIiwiaWF0IjoxNDcyNDEzNDk4LCJleHAiOjE0NzMyNzc0OTh9.AJv8vuhoO5I1XFwX821PyBDfgKxxYIO3LBn3Z638lnY";


	beforeEach(angular.mock.module('rssreader'));
	beforeEach(angular.mock.inject(function (_$controller_) {
		$controller = _$controller_;
	}));
	beforeEach(inject(function (_authService_, _$q_, _$httpBackend_) {
		authService = _authService_;
		$q = _$q_;
		$httpBackend = _$httpBackend_;
	}));

	describe('authService', function () {

		var res = {};
		it('should create a new user', function () {
			$httpBackend.when('POST', '/register', user).respond(response_success);
			authService.register(user).then(function (response) {
				res = response;
			});
			expect(authService.register()).toBeDefined();
			expect(user.email).toBe('test222@gmail.com');

		});
	});

	describe('AuthController', function () {

		it('should be defined and create a new user', inject(function ($http) {
			var $scope = {};
			var controller = $controller('AuthController', {
				$scope: $scope
			});
			$scope.user = {
				email: "test222@gmail.com",
				password: "123456789aA!",
				repPassword: "123456789aA!"
			};
			var form = {
				validate: function () {
					return true;
				}
			};
			$http.post('http://localhost/auth', {
					username: 'hardcoded_user',
					password: 'hardcoded_password'
				})
				.success(function (data, status, headers, config) {
					$scope.user = data;
				});

			$httpBackend
				.when('POST', 'http://localhost/auth', '{"username":"hardcoded_user","password":"hardcoded_password"}')
				.respond({
					username: 'hardcoded_user'
				});
			afterEach(function () {
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
			});

			$httpBackend.flush();

			expect($scope.user).toEqual({
				username: 'hardcoded_user'
			});



			expect($scope.user.email).toBeDefined('test222@gmail.com');
			expect(authService).toBeDefined();
			expect(authService.register()).toBeDefined();
			expect($scope.user).toBeDefined();

		}));
	});


});