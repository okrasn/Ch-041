describe('Controller : AccordionCtrl', function() {
    var AccordionCtrl ;
    beforeEach(module('schedule'));
    it('should create three groups', function() {

        expect($scope.groupsData.length).toBe(3);
    });

});