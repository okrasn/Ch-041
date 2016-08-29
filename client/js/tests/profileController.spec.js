describe('ProfileController', function(){
	it('should exist' , function(){
		var $scope = {};
		var controller = $controller('ProfileController', {
			$scope: $scope
	});
		expect($scope.changePass()).toBeDefined();
	});
});