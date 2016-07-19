<<<<<<< HEAD

describe('AccordionCtrl', function() {
    beforeEach(module('schedule'));
    it('should contain `test` number 2', inject(function($controller){
        var scope = {};
        var ctrl = $controller('AccordionCtrl',{$scope : scope});
        expect(scope.test).toBe(2);
    }));
=======
describe('AccordionCtrl', function() {
	beforeEach(module('accordion'))
it('should contain `groupsData` with 3 groups', inject(function($controller){
	var scope = {};
	var ctrl = $controller('AccordionCtrl',{$scope : scope})
	expect(scope.groupsData.length.toBe(3));
}));
>>>>>>> 989a5a18ee33fbdab85c3b1119658e72c0ee7da1

});
