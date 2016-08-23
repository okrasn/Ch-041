(function () {
    'use strict';
    angular.module('rssreader').service('toasterService', ['$compile', '$animate', function ($compile, $animate) {
        var domParent = angular.element('body');

        //********************************************************************************
        //  You can pass custom options to toaster methods as second parameter
        //  options properties:
        //  message: string
        //  overlay: boolean
        //  delay: value (ms)
        //  type: one of ['toaster-default', 'toaster-success', 'toaster-info', 'toaster-error']
        //  iconClass: string (name of glyph class, ex: fa fa-info)
        // 
        //********************************************************************************

        var buildToaster = function (scope, options, onShow) {
            var callback = arguments[2];
            if (typeof arguments[0] !== "object") {
                throw new Error("You are calling toaster with wrong parameters");
            }
            var elem = angular.element(document.createElement("toaster"));
            elem.addClass('toaster-wrapper');
            elem.addClass(options.type);
            if (options.overlay) {
                elem.attr("overlay", options.overlay);
            }

            if (options.delay) {
                elem.attr("delay", options.delay);
            }

            var icon = angular.element(document.createElement("div"));
            icon.addClass('toaster-icon');
            icon.addClass(options.iconClass);
            elem.append(icon);

            elem.append("<span>" + options.message + "</span>");
            if (options.htmlContent) {
                elem.append("<span>" + options.htmlContent + "</span>");
            }
            var appendHtml = $compile(elem, scope)(scope.$new());
            $animate.enter(appendHtml, domParent).then(function () {
                if (typeof callback === 'function') {
                    onShow();
                }
            });
        }
        this.confirmFeedDelete = function (scope, customOptions, onShow) {
            var defaultOptions = {
                message: 'Remove this feed?',
                type: 'toaster-default',
                overlay: true,
                iconClass: 'fa fa-question',
                htmlContent: "<button class='app-btn-toaster-red' aria-label='Justify' ng-click='confirmFeedDelete()'>yes</button><button class='app-btn-toaster' aria-label='Justify' ng-click='hideToaster()'>no</button>"
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(scope, options, onShow);
        }
        this.confirmFavArticleDelete = function (scope, customOptions, onShow) {
            var defaultOptions = {
                message: 'Remove article?',
                type: 'toaster-default',
                overlay: true,
                iconClass: 'fa fa-question',
                htmlContent: "<button class='app-btn-toaster-red' aria-label='Justify' ng-click='confirmRemoveFavourite()'>yes</button><button class='app-btn-toaster' aria-label='Justify' ng-click='hideToaster()'>no</button>"
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(scope, options, onShow);
        }
        this.success = function (scope, customOptions, onShow) {
            var defaultOptions = {
                message: "Success!",
                type: 'toaster-success',
                iconClass: 'fa fa-check',
                delay: 3000
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(scope, options, onShow);
        }
        this.info = function (scope, options, onShow) {
            var defaultOptions = {
                message: "Info",
                type: 'toaster-info',
                iconClass: 'fa fa-info',
                delay: 3000
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(scope, options, onShow);
        }
        this.error = function (scope, options, onShow) {
            var defaultOptions = {
                message: "Error!",
                type: 'toaster-error',
                iconClass: 'fa fa-exclamation-triangle',
                delay: 3000
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(scope, options, onShow);
        }
        this.custom = function (scope, options, onShow) {
            var defaultOptions = {
                message: 'Description',
                type: 'toaster-default',
                overlay: true,
                iconClass: 'fa fa-info',
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(scope, options, onShow);
        }
        this.removeToaster = function (element) {
            $animate.leave(element, domParent).then(function () {
            });
        }
    }]);
})();