angular.module('rssreader').directive('toaster', ['$timeout', 'toasterService', function ($timeout, toasterService) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element, attrs) {
            if (attrs.overlay) {
                scope.overlay = true;
            }
            else {
                scope.overlay = false;
            }
            scope.toasterStyle = {};
            scope.confirmFeedDelete = function () {
                scope.$parent.confirmFeedDelete();
                scope.hideToaster();
            }
            scope.confirmRemoveFavourite = function () {
                scope.$parent.confirmRemoveFavourite();
                scope.hideToaster();
            }
            scope.hideToaster = function () {
                $timeout.cancel(scope.timer);
                scope.$destroy();
                toasterService.removeToaster(element);
            };
            scope.timer = $timeout(function () {
                scope.hideToaster();
            }, 5000);
        },
        templateUrl: '../partials/modals/toaster.html'
    };
}]);