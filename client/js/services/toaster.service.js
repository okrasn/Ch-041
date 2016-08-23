(function () {
	'use strict';
	angular.module('rssreader').service('toasterService', ['$compile', '$animate', function ($compile, $animate) {
		var domParent = angular.element('body');
		var toasters = [];
		var buildToaster = function () {

		}
		// TODO: need some more refactoring, better to use single buildToaster method with options parameter. Will be done soon.
		this.confirmFeedDelete = function (elementName, scope) {
			var appendHtml = $compile("<toaster class='toaster-default toaster-wrapper' overlay='true'><div class='toaster-icon fa fa-question'></div><span>Delete this feed</span><button class='app-btn-toaster-red' aria-label='Justify' ng-click='confirmFeedDelete()'>yes</button><button class='app-btn-toaster' aria-label='Justify' ng-click='hideToaster()'>no</button></toaster>")(scope.$new());
			$animate.enter(appendHtml, domParent).then(function () {
			});
		}
		this.confirmFavArticleDelete = function (elementName, scope) {
		    var appendHtml = $compile("<toaster class='toaster-default toaster-wrapper' overlay='true'><div class='toaster-icon fa fa-question'></div><span>Remove article from favourites?</span><button class='app-btn-toaster-red' aria-label='Justify' ng-click='confirmRemoveFavourite()'>yes</button><button class='app-btn-toaster' aria-label='Justify' ng-click='hideToaster()'>no</button></toaster>")(scope.$new());
			$animate.enter(appendHtml, domParent).then(function () {
			});
		}
		this.success = function (message, scope) {
			var appendHtml = $compile("<toaster class='toaster-success toaster-wrapper'><div class='toaster-icon fa fa-check'></div><div>" + message + "</span></toaster>")(scope.$new());
			$animate.enter(appendHtml, domParent).then(function () {
			});
		}
		this.info = function (info, scope) {
			var appendHtml = $compile("<toaster class='toaster-info toaster-wrapper'><div class='toaster-icon fa fa-info'><div>" + info + "</span></toaster>")(scope.$new());
			$animate.enter(appendHtml, domParent).then(function () {
			});
		}
		this.error = function (error, scope) {
			var appendHtml = $compile("<toaster class='toaster-error toaster-wrapper'><div class='toaster-icon fa fa-exclamation-triangle'><div>" + error + "</span></toaster>")(scope.$new());
			$animate.enter(appendHtml, domParent).then(function () {
			});
		}
		this.removeToaster = function (element) {
			$animate.leave(element, domParent).then(function () {
			});
		}
	}]);
})();