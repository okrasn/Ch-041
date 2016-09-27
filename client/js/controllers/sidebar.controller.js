(function () {
	'use strict';
	angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
		$scope.feedsListDragableTypes = ['feeds'];
		$scope.favsListDragableTypes = ['favs'];
		$scope.currentArticlesType = dashboardService.currentArticlesType;
		$scope.currentSelectedItem;
		$scope.feedsData = feedsService;
		$scope.feeds = $scope.feedsData.feedsDictionary;
		$scope.favs = $scope.feedsData.favouritesDictionary;
		$scope.onFeedsDrag = function (index) {
			dashboardService.displayLoading();
			$scope.feeds.splice(index, 1);
			feedsService.setFeedsOrder().then(function (resp) {
				dashboardService.hideLoading();
			});
		}
		$scope.onFavsDrag = function (index) {
		    dashboardService.displayLoading();
		    $scope.favs.splice(index, 1);
		    feedsService.setFavsOrder().then(function (resp) {
		        dashboardService.hideLoading();
		    });
		}
		$scope.IgnoreDoubleClick = function () {
		    console.log("dblclick");
		    return false;
		}
		$scope.getAll = function ($event) {
		    dashboardService.sidebar = false;
			setArticlesType(angular.element($event.currentTarget).parent(), 'all');
			// if there is only one category and feed, return this feed articles
			if ($scope.feeds.length === 1 && $scope.feeds[0].feeds.length === 1) {
			    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: $scope.feeds[0].feeds[0]._id});
			} else {				
			    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all', value1: '', value2: '' });
			}
		}
		$scope.getByFeed = function ($event, feed) {
		    dashboardService.sidebar = false;
		    setArticlesType(angular.element($event.currentTarget).parent());
		    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: feed._id, value2: '' });
		}
		$scope.getByCat = function ($event, cat, index) {
		    dashboardService.sidebar = false;
			setArticlesType(angular.element($event.currentTarget).parent(), 'category', cat);
			$scope.shevronToggle($event);
			// if there is only one feed within selected category, return its articles
			if ($scope.feeds[arguments[2]].feeds.length == 1) {
				$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: $scope.feeds[arguments[2]].feeds[0]._id });
			} else {
			    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'category', value1: cat });
			}
		}

		$scope.getFavourites = function ($event) {
		    setArticlesType(angular.element($event.currentTarget).parent(), 'favourites');
		    $scope.shevronToggle($event);
		    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'favourites', value1: '', value2: '' });
		}

		$scope.getFavArticlesByCat = function ($event, cat) {
		    setArticlesType(angular.element($event.currentTarget).parent(), 'favourites', cat);
		    $scope.shevronToggle($event);
		    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'favourites', value1: 'category', value2: cat });
		}

		$scope.getFavArticle = function ($event, article) {
		    articlesService.articleForRead = article;
		    dashboardService.sidebar = false;
		    setArticlesType(angular.element($event.currentTarget).parent());
		    $state.go('dashboard.article', { feed: article.feed, link: article.link, type: 'favourite'});
		}

		$scope.shevronToggle = function ($event) {
		    if ($event.currentTarget.attributes['aria-expanded']) {
		        if ($event.currentTarget.attributes['aria-expanded'].value == 'true') {
		            angular.element($event.currentTarget).removeClass('chevron-down');
		        }
		        if ($event.currentTarget.attributes['aria-expanded'].value == 'false') {
		            angular.element($event.currentTarget).addClass('chevron-down');
		        }
		    }
		    else {
		        angular.element($event.currentTarget).addClass('chevron-down');
		    }
		}
		$scope.hideFavourites = function () {
		    return $scope.feedsData.favouritesDictionary.length;
		}

		$scope.checkIfEmpty = function () {
			if (feedsService.feedsDictionary.length == 0) {
				return false;
			} else return true;
		}
		$scope.toggle = false;
		$scope.toAddFeed = function () {
		    dashboardService.sidebar = false;
		    $state.go('dashboard.addFeed', { reload: true });
		}
		var setArticlesType = function (element, type, value) {
			if ($scope.currentSelectedItem) {
				$scope.currentSelectedItem.removeClass('selected');
			}
			if (type === 'category') {
			    $scope.currentSelectedItem = element.parent();
			}
			else {
			    $scope.currentSelectedItem = element;
			}
			$scope.currentSelectedItem.addClass('selected');
		}
	}]);
})();