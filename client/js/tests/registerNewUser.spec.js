describe('authService and AuthController', function () {
	var $controller, authService, $q, $httpBackend,
		user = {
			email: "test222@gmail.com",
			password: "123456789aA!",
			repPassword: "123456789aA!"
		},
		token = 
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



		
		it('should exist register and user', function () {
			expect(authService.register()).toBeDefined();
			expect(user.email).toBe('test222@gmail.com');

		});
	

	

		it('should be create a new user in AuthController', inject(function ($http) {
			var $scope = {};
			var controller = $controller('AuthController', {
				$scope: $scope
			});
			$scope.res;
			beforeEach('init res', function(){
				$scope.res = {};		
			})
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
<<<<<<< HEAD
			$http.post('/register', $scope.user)
				.success(function (data, status, headers, config) {
					$scope.user = data;
				});

			$httpBackend.when('POST', '/register', '{"email": "test222@gmail.com","password":"123456789aA!",
				"repPassword": "123456789aA!"}')
				.respond({
					token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2MzM2YzOWMxMTE1MjA0MTJmMGJlZWUiLCJlbWFpbCI6InRlc3QyMjJAZ21haWwuY3BtIiwiaWF0IjoxNDcyNDEzNDk4LCJleHAiOjE0NzMyNzc0OTh9.AJv8vuhoO5I1XFwX821PyBDfgKxxYIO3LBn3Z638lnY"
				});
		

			$httpBackend.flush();

			expect($scope.user).toEqual({});



			expect($scope.user.email).toBeDefined('test222@gmail.com');
=======
			
			expect(authService.register()).toBeDefined();
			expect($scope.user.email).toBe('test222@gmail.com');
>>>>>>> 9bb7f43099390eb6772eb380f604e64f86193af4
			expect(authService).toBeDefined();
			expect(authService.register()).toBeDefined();
			expect($scope.user).toBeDefined();

		}));
<<<<<<< HEAD
	});
=======
		it('should exist and change password in ProfileController', function(){
			var $scope = {};
			var controller = $controller('ProfileController', {
				$scope: $scope
			});	
			expect(ProfileController).toBeDefined();
		});
>>>>>>> 9bb7f43099390eb6772eb380f604e64f86193af4
	


});