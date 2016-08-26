describe('Controller: AuthController', function () {
    var AuthController, scope;
    // load the controller's module
    beforeEach(function(){
        module('rssreader');
        inject(function ($controller) {
            var scope = {};
            AuthController = $controller('AuthController', {
                $scope:scope
            });
        });
    });
    it('should do something', function () {
        expect(scope.validationLoginOptions()).toBeDefined();
    });
}); 
