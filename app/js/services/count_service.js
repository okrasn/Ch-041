angular.module('service.count',[])
	.factory('count_service',[function(){
		var enteredSubject = '';
		var arrayObjects = [];
		function setData(data){
			enteredSubject = data;
		}
		function getData(){
			return enteredSubject;
		}
		function setArrayObjects(obj){
			arrayObjects = obj;
		}
		function getArrayObject(){
			return arrayObjects;
		}
		function counter(){
			var counter = 0;
			var daysLength = arrayObjects.length;
			for(var i = 0; i < daysLength;i++){
				for(var j = 0; j < arrayObjects[i].subject.length;j++){
					if(enteredSubject === arrayObjects[i].subject[j].subject) {
						counter++;
					}
				}
			}
			return counter;
		}

		return {
			setData : setData,
			getData : getData,
			setArrayObjects : setArrayObjects,
			getArrayObject : getArrayObject,
			counter : counter
		}

	}]);