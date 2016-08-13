(function () {
    'use strict';
    angular.module('rssreader').service('dashboardService', [function () {
        var obj = {}
        obj.DEFAULT_VIEW = 2;
        obj.currentViewMode = obj.DEFAULT_VIEW;

        // We have three view modes
        obj.viewModes = [
        'list',
        'th-list',
        'th-large'
    ];
        obj.alertMsg = "";
        obj.successMsg = "";
        obj.resetViewMode = function () {
            obj.currentViewMode = obj.DEFAULT_VIEW;
        }
        obj.setViewMode = function (index) {
            if (index > obj.viewModes.length - 1) {
                throw new Error("View mode you are trying to set is not defined");
            } else {
                obj.currentViewMode = index;
            }
        }
        obj.getViewMode = function () {
            return obj.viewModes[obj.currentViewMode];
        }
        obj.title = "";
        obj.setTitle = function (title) {
            if (title == "Add Feed") {
                obj.resetFeedId();
            }
            obj.title = title;
        }
        obj.getTitle = function () {
            return obj.title;
        }
        obj.currentView = obj.DEFAULT_VIEW;
        obj.currentFeed = '';
        obj.getFeedId = function () {
            return obj.currentFeed;
        }
        obj.setFeedId = function (id) {
            obj.currentFeed = id;
        }
        obj.resetFeedId = function () {
            obj.currentFeed = '';
        }
        return obj;
}]);
})();