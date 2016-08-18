angular.module('rssreader').directive('toaster', [function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            scope.toasterStyle = {};

            if (attrs.width)
                scope.toasterStyle.width = attrs.width;
            if (attrs.height)
                scope.toasterStyle.height = attrs.height;
            scope.hideToaster= function () {
                scope.show = false;
            };
            
        },
        templateUrl: '../partials/modals/toaster.html' 
    };
}]);