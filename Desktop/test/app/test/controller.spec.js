
describe('AccordionCtrl', function() {
    beforeEach(module('schedule'));
    it('should contain `test` number 2', inject(function($controller){
        var scope = {};
        var ctrl = $controller('AccordionCtrl',{$scope : scope});
        expect(scope.test).toBe(2);
    }));

});
