angular.module('rssreader').service('dashboardService', ['$window', function ($window) {
	var that = this;
	this.DEFAULT_VIEW = 2;
	this.currentArticlesType = 'all';
	this.currentArticlesValue = $window.localStorage.category;
	this.isReadingArticle = false;
	this.loadingIcon = false;

	this.displayLoading = function () {
	    that.loadingIcon = true;
	}

	this.hideLoading = function () {
	    that.loadingIcon = false;
	}

	this.sortParam = {
		type: 'date',
		order: 0
	};
	if ($window.localStorage.sortType) {
		this.sortParam.type = $window.localStorage.sortType;
		if ($window.localStorage.sortOrder) {
			this.sortParam.order = +$window.localStorage.sortOrder;
		}
	}
	else {
		$window.localStorage.sortType = this.sortParam.type;
		$window.localStorage.sortOrder = this.sortParam.order;
	}
	this.setSortParam = function (type, order) {
		this.sortParam.type = type;
		this.sortParam.order = order;
		$window.localStorage.sortType = this.sortParam.type;
		$window.localStorage.sortOrder = this.sortParam.order;
	}
	this.getSortParam = function () {
		return that.sortParam;
	}

	if (!$window.localStorage.articlesType) {
		$window.localStorage.articlesType = that.currentArticlesType;
	}

	if ($window.localStorage.category) {
		currentArticlesValue = $window.localStorage.category;
	}

	this.setCurrentArticlesType = function (type, value) {
		that.currentArticlesValue = null;
		that.currentArticlesType = type;
		$window.localStorage.articlesType = that.currentArticlesType;
		if (value) {
			that.currentArticlesValue = value;
			$window.localStorage.category = that.currentArticlesValue;
		}
	}
	this.getCurrentArticlesType = function () {
		that.currentArticlesType = $window.localStorage.articlesType;
		return that.currentArticlesType;
	}
	if (!$window.localStorage.viewMode) {
		$window.localStorage.viewMode = this.DEFAULT_VIEW;
	}
	this.isLoading = function () {
		return that.loadingIcon;
	};
	this.sidebar = false;
	this.checkSidebar = function () {
		return that.sidebar;
	}
	this.modalShown = false;
	this.currentViewMode = $window.localStorage.viewMode;
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
	this.title = '';
	this.setTitle = function (title) {
		if (title == "Add Feed") {
			this.resetFeedId();
		}
		that.title = title;
	}
	this.getTitle = function () {
		return that.title;
	}

	this.currentFeed = null;
	this.getFeedId = function () {
		return that.currentFeed;
	}
	this.setFeedId = function (feed) {
		that.currentFeed = feed;
	}
	this.resetFeedId = function () {
		that.currentFeed = '';
	}
}]);