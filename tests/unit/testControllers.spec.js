describe('Controllers Testing', function() {
    var $scope,
        $controller,
        mockScope = {};

    beforeEach(angular.mock.module('rssreader'));

    beforeEach(angular.mock.inject(function(_$controller_, $rootScope) {
        $controller = _$controller_;
        mockScope = $rootScope.$new();
    }));

    describe('Test controllers to be defined', function() {
    	it("test articles controller", function() {
            var $scope = {};
            var controller = $controller('ArticlesController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test auth controller", function() {
            var $scope = {};
            var controller = $controller('ProfileController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test dashboard controller", function() {
            var $scope = {};
            var controller = $controller('DashboardController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test feeds controller", function() {
            var $scope = {};
            var controller = $controller('FeedsController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test profile controller", function() {
            var $scope = {};
            var controller = $controller('ProfileController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test home controller", function() {
            var $scope = {};
            var controller = $controller('HomeController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test navbar controller", function() {
            var $scope = {};
            var controller = $controller('NavbarController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test index controller", function() {
            var $scope = {};
            var controller = $controller('IndexController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
        it("test sidebar controller", function() {
            var $scope = {};
            var controller = $controller('SidebarController', { $scope: $scope });
            expect($controller).toBeDefined();
        });
    });

    describe('Testing controllers definding function', function() {
        it("test function in auth_ctrl", function() {
            var $scope = {};
            var controller = $controller('AuthController', { $scope: $scope });
            expect($scope.logIn).toBeDefined();
            expect($scope.register).toBeDefined();
            expect($scope.user).toBeDefined();
        });
        it("test function in profile_ctrl", function() {
            var $scope = {};
            var controller = $controller('ProfileController', { $scope: $scope });
            expect($scope.submit).toBeDefined();
            expect($scope.upload).toBeDefined();
            expect($scope.changePass).toBeDefined();
        });
    });

    describe('Testing variables in Ctrls', function() {
        it("test counter", function() {
        var $scope = {};
        var controller = $controller('AuthController', { $scope: $scope });
        expect($scope.test).toEqual(5);
    	});
        it("test var in profile_ctrl", function() {
            var $scope = {};
            var controller = $controller('AuthController', { $scope: $scope });
            $scope.defaultAgreeWith();
            expect($scope.agreeWith).toEqual(false);
        });
        it("test var in profile_ctrl2", function() {
            var $scope = {};
            var controller = $controller('ProfileController', { $scope: mockScope});
            expect($scope.PROFILE_ERRORS).toBeDefined;
        });
    });
});
