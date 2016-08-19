angular.module('rssreader').service('dashboardService', ['$window', function ($window) {
    var that = this;
    this.DEFAULT_VIEW = 2;

    if (!$window.localStorage.viewMode) {
        $window.localStorage.viewMode = this.DEFAULT_VIEW;
    }

    this.sidebar = true;
    this.checkSidebar = function () {
        return that.sidebar;
    }
    this.currentViewMode = $window.localStorage.viewMode;
    this.modalShown = false;
    this.viewModes = [
        'list',
        'th-list',
        'th-large'
    ];
    this.resetViewMode = function () {
        $window.localStorage.viewMode = this.DEFAULT_VIEW;
    }
    this.setViewMode = function (index) {
        $window.localStorage.viewMode = index;
        if (index > that.viewModes.length - 1) {
            throw new Error("View mode you are trying to set is not defined");
        } else {
            that.currentViewMode = $window.localStorage.viewMode;
        }
    }
    this.getViewMode = function () {
        that.currentViewMode = $window.localStorage.viewMode;
        return that.viewModes[that.currentViewMode];
    }
    this.title = "";
    this.setTitle = function (title) {
        if (title == "Add Feed") {
            this.resetFeedId();
        }
        that.title = title;
    }
    this.getTitle = function () {
        return that.title;
    }

    this.currentFeed = '';
    this.getFeedId = function () {
        return that.currentFeed;
    }
    this.setFeedId = function (id) {
        that.currentFeed = id;
    }
    this.resetFeedId = function () {
        that.currentFeed = '';
    }
}]);