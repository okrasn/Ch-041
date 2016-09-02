(function () {
	'use strict';
	angular.module('rssreader').directive('modal', [function () {
		return {
			restrict: 'E',
			scope: {
				show: '='
			},
			replace: true,
			transclude: true,
			link: function (scope, element, attrs) {
				scope.modalStyle = {};

				scope.hideModal = function () {
					scope.show = false;
				};
			},
			templateUrl: '../partials/modals/modal.html'
		};
	}]);
})();