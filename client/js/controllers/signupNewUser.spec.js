describe('Controller: AuthController', function() {
  var LoginCtrl, $httpBackend, $rootScope, $provide, $location, $cookieStore, scope;
  beforeEach(module('rssreader'));

  beforeEach(inject(function($injector) {
    $httpBackend=$injector.get('$httpBackend');
    $rootScope=$injector.get('$rootScope');
    $cookieStore=$injector.get('$cookieStore');
    $controller=$injector.get('$controller');
    $location=$injector.get('$location');


    LoginCtrl=function() {
      return $controller('AuthController', { 
        '$scope': $rootScope,
        '$cookie': $cookieStore,
        '$location': $location
      });
    };
  }));

  
  it('should have a AuthController controller', function() {
    expect('rssreader.AuthController').toBeDefined();
  });

  
});