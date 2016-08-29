
describe('authService', function () {
	
	beforeEach(angular.mock.module('rssreader'));
	beforeEach(angular.mock.inject(function (_authService_, _$q_, _$httpBackend_) {
		authService = _authService_;
		$q = _$q_;
		$httpBackend = _$httpBackend_;
	}));
	it('should demonstrate using when (200 status)', inject(function ($http) {

		var $scope = {};
			$scope.user = {
				email: "test222@gmail.com",
				password: "123456789aA!",
				repPassword: "123456789aA!"
			};

		/* Code Under Test */
		$http.post('/register', $scope.user)
			.success(function (data, status, headers, config) {
				$scope.response = data;
			})
			.error(function (data, status, headers, config) {
				$scope.valid = false;
			});
		/* End */
		$httpBackend.expect('GET', './partials/home.html').respond(200);
		$httpBackend.when('POST', '/register', $scope.user).respond(200, {"token": 	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2MzM2YzOWMxMTE1MjA0MTJmMGJlZWUiLCJlbWFpbCI6InRlc3QyMjJAZ21haWwuY3BtIiwiaWF0IjoxNDcyNDEzNDk4LCJleHAiOjE0NzMyNzc0OTh9.AJv8vuhoO5I1XFwX821PyBDfgKxxYIO3LBn3Z638lnY"
		});

		$httpBackend.flush();
		expect($scope.user.email).toEqual("test222@gmail.com");
		expect($scope.response).toEqual({
			"token": 	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2MzM2YzOWMxMTE1MjA0MTJmMGJlZWUiLCJlbWFpbCI6InRlc3QyMjJAZ21haWwuY3BtIiwiaWF0IjoxNDcyNDEzNDk4LCJleHAiOjE0NzMyNzc0OTh9.AJv8vuhoO5I1XFwX821PyBDfgKxxYIO3LBn3Z638lnY"
		});

	}));

});