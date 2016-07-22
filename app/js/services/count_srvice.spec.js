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
    describe('.getData()', function() {
        it('should exist', function() {
            //expect(count_service.setData('git'));
            //expect(count_service.getData()).toEqual('git');

            //expect(count_service.getArrayObject()).toEqual(['git','git','git','git','git']);
            //expect(count_service.counter()).toEqual(0);

        });
    });
    describe('count service', function() {
        it('should count the number of same subject and return number', function() {
            var enteredSubject = 'git',counter = 0;
            var arrayObjects = {

                subject :[
                    {
                        time : "09:00-09:55",
                        subject : "git"
                    },{
                        time : "10:00-10:55",
                        subject : "git"

                    },{
                        time : "11:00-11:55",
                        subject : "git"

                    },{
                        time : "12:00-12:55",
                        subject : "git"

                    },{
                        time : "13:00-13:55",
                        subject : "git"

                    },{
                        time : "14:00-14:55",
                        subject : "git"
                    }
                ]



            };

                for(var i = 0; i < 6;i++){
                    for(var j = 0; j < arrayObjects.subject.length;j++){
                        if(enteredSubject === arrayObjects.subject[j].subject) {
                            counter++;
                        }
                    }
                }



            expect(count_service.setArrayObjects(arrayObjects));
            expect(count_service.getArrayObject());
            expect(count_service.counter()).toEqual(6);











        });
    });
});
