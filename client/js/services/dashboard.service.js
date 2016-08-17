angular.module('rssreader').service('dashboardService', ['$window', function ($window) {
    if(!$window.localStorage['view-mode']){
        $window.localStorage['view-mode'] = this.DEFAULT_VIEW;
    }
    
    var that = this;
    this.DEFAULT_VIEW = 2;
    this.currentViewMode = $window.localStorage['view-mode'];

    // We have three view modes
    this.viewModes = [
        'list',
        'th-list',
        'th-large'
    ];
    this.resetViewMode = function () {
        $window.localStorage['view-mode'] = this.DEFAULT_VIEW;
    }
    this.setViewMode = function (index) {
        $window.localStorage['view-mode'] = index;
        if (index > that.viewModes.length - 1) {
            throw new Error("View mode you are trying to set is not defined");
        } else {
            that.currentViewMode = $window.localStorage['view-mode'];
        }
    }
    this.getViewMode = function () {
        that.currentViewMode = $window.localStorage['view-mode'];
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