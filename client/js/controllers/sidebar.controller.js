(function () {
	'use strict';
	angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
		$scope.feedsListDragableTypes = ['feeds'];
		$scope.favsListDragableTypes = ['favs'];
		$scope.currentArticlesType = dashboardService.currentArticlesType;
		$scope.currentSelectedItem;
		$scope.feeds = feedsService.feedsDictionary;
		$scope.favs = feedsService.favouritesDictionary;
		$scope.onFeedsDrag = function (index) {
			dashboardService.loadingIcon = true;
			$scope.feeds.splice(index, 1);
			feedsService.setFeedsOrder().then(function (resp) {
				dashboardService.loadingIcon = false;
			});
		}
		$scope.onFavsDrag = function (index) {
			dashboardService.loadingIcon = true;
			$scope.favs.splice(index, 1);
			feedsService.setFavsOrder().then(function (resp) {
				dashboardService.loadingIcon = false;
			});
		}
		$scope.getAll = function ($event) {
			setArticlesType(angular.element($event.currentTarget).parent(), 'all');
			// if there is only one category and feed, return this feed articles
			if ($scope.feeds.length === 1 && $scope.feeds[0].values.length === 1) {
				articlesService.getArticlesByFeed($scope.feeds[0].values[0]);
			} else {
				articlesService.getAllArticles();
			}
			$state.go("dashboard." + dashboardService.getViewMode());
		}
		$scope.getByFeed = function ($event, feed) {
			setArticlesType(angular.element($event.currentTarget).parent());
			articlesService.getArticlesByFeed(feed);
			$state.go("dashboard." + dashboardService.getViewMode());
		}
		$scope.getByCat = function ($event, cat, index) {
			setArticlesType(angular.element($event.currentTarget).parent(), 'category', cat);
			if ($event.currentTarget.attributes[4]) {
				if ($event.currentTarget.attributes[4].value == 'true') {
					angular.element($event.currentTarget).removeClass('chevron-down');
				}
				if ($event.currentTarget.attributes[4].value == 'false') {
					angular.element($event.currentTarget).addClass('chevron-down');
				}
			}
			else {
				angular.element($event.currentTarget).addClass('chevron-down');
			}
			// if there is only one feed within selected category, return its articles
			if ($scope.feeds[arguments[2]].feeds.length == 1) {
				articlesService.getArticlesByFeed($scope.feeds[arguments[2]].feeds[0]);
			} else {
				articlesService.getArticlesByCat(arguments[1]);
			}
			$state.go("dashboard." + dashboardService.getViewMode());
		}
		$scope.getFavourites = function ($event) {
			setArticlesType(angular.element($event.currentTarget).parent(), 'favourites');
			if ($event.currentTarget.attributes[4]) {
				if ($event.currentTarget.attributes[4].value == 'true') {
					angular.element($event.currentTarget).removeClass('chevron-down');
				}
				if ($event.currentTarget.attributes[4].value == 'false') {
					angular.element($event.currentTarget).addClass('chevron-down');
				}
			}
			else {
				angular.element($event.currentTarget).addClass('chevron-down');
			}
			articlesService.getFavourites();
			$state.go("dashboard." + dashboardService.getViewMode());
		}
		$scope.getFavArticlesByCat = function ($event, cat) {
			setArticlesType(angular.element($event.currentTarget).parent(), 'category', cat);
			if ($event.currentTarget.attributes[4]) {
				if ($event.currentTarget.attributes[4].value == 'true') {
					angular.element($event.currentTarget).removeClass('chevron-down');
				}
				if ($event.currentTarget.attributes[4].value == 'false') {
					angular.element($event.currentTarget).addClass('chevron-down');
				}
			}
			else {
				angular.element($event.currentTarget).addClass('chevron-down');
			}
			articlesService.getFavArticlesByCat(arguments[1]);
			$state.go("dashboard." + dashboardService.getViewMode());
		}
		$scope.getFavArticle = function ($event, article) {
			setArticlesType(angular.element($event.currentTarget).parent());
			articlesService.getFavArticle(article);
			$state.go("dashboard." + dashboardService.getViewMode());
		}
		$scope.hideFavourites = function () {
			return $scope.favs.length;
		}

		$scope.checkIfEmpty = function () {
			if (feedsService.feedsDictionary.length == 0) {
				return false;
			} else return true;
		}
		$scope.toggle = false;
		
		var setArticlesType = function (element, type, value) {
			if (type && value) {
				dashboardService.setCurrentArticlesType(type, value);
			}
			if ($scope.currentSelectedItem) {
				$scope.currentSelectedItem.removeClass('selected');
			}
			$scope.currentSelectedItem = element;
			$scope.currentSelectedItem.addClass('selected');
		}
	}]);
})();