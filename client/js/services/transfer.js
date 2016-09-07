angular.module('rssreader')
	.factory('transfer', [function () {
		var obj = {};
		var str = '';
		var providerString = '';

		function setProviderString (data) {
			providerString = data;
		}
		function getProviderString () {
			return providerString;
		}
		function setString (data) {
			str = data;
		}
		function getString () {
			return str;
		}
		function setObj (data) {
			obj = data;
		}
		function getObj () {
			return obj;
		}
		return {
		  
			setObj : setObj,
			getObj : getObj,
			setString : setString,
			getString : getString,
			setProviderString : setProviderString,
			getProviderString : getProviderString
		}
	}]);

