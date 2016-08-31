angular.module('rssreader')
	.factory('transfer', [function() {
		var obj = {};
		function setObj(data){
			obj = data;
		}
		function getObj(){
			return obj;
		}
		return {
		  
			setObj : setObj,
			getObj : getObj
		}
	}]);