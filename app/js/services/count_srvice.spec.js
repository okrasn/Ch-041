describe('service_spec Factory',function(){
var count_service;
    beforeEach(angular.mock.module('service.count'));
    beforeEach(inject(function(_count_service_){
        count_service = _count_service_;
    }));
    it('should be defined',function(){
        expect(count_service).toBeDefined();
    });
    describe('.counter()', function() {
        it('should exist', function() {
            expect(count_service.counter()).toBeDefined();
        });
    });
});
