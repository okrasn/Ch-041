describe('AccordionCtrl', function() {
	beforeEach(module('accordion'))
it('should contain `groupsData` with 3 groups', inject(function($controller){
	var scope = {};
	var ctrl = $controller('AccordionCtrl',{$scope : scope})
	expect(scope.groupsData.length.toBe(3));
}));

});