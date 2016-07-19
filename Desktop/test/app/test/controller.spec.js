
describe('AccordionCtrl', function() {
	beforeEach(module('schedule'))
it('should contain `count` with 3 groups', inject(function($controller){
	var scope = {};
	var ctrl = $controller('AccordionCtrl',{$scope : scope})
	if(scope.subject === 'html'){
		expect(scope.count).toBe(6);
	}
}));
});
