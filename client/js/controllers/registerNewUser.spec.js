describe("authService should create a new user", function () {
    var authService;
    beforeEach(angular.mock.module('rssreader'));

    beforeEach(inject(function (_authService_) {
        authService = _authService_;
    }));

    it("authService should exist", function () {
        expect(authService).toBeDefined();
    });
});
//
//
//describe("rssreader should create a new user", function () {
//    var $controller, AuthController;
//    beforeEach(angular.mock.module('ui.router'));
//    beforeEach(angular.mock.module('rssreader'));
//
//    beforeEach(inject(function (_$controller_) {
//		$controller = _$controller_;
//		AuthController = $controller('AuthController', {});
//    }));
//
//    it("AuthController should exist", function () {
//        expect(AuthController).toBeDefined();
//    });
//});
