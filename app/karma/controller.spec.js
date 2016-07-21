
describe('AccordionCtrl', function() {
	beforeEach(module('schedule'));
it('should contain `counter` with 6 hours', inject(function($controller){
	var scope = {};
	var ctrl = $controller('AccordionCtrl',{$scope : scope});
		expect(scope.selected_value.value).toBe('git');
}));
});