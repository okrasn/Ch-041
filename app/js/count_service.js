angular.module('service.count',[])
	.factory('count_service',[function(){
		var dataString = '';
		function setData(data){
			dataString = data;
		}
		function getData(){
			return dataString;
		}
		return {
			setData : setData,
			getData : getData
		}
		console.log(dataString);

	}]);