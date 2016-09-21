(function () {
	'use strict';
	angular.module('rssreader').controller('SidebarController', ['$scope', '$state', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, feedsService, articlesService, dashboardService) {
		$scope.feedsListDragableTypes = ['feeds'];
		$scope.favsListDragableTypes = ['favs'];
		$scope.currentArticlesType = dashboardService.currentArticlesType;
		$scope.currentSelectedItem;
		$scope.feeds = feedsService.feedsDictionary;
		$scope.feedsData = feedsService;
		$scope.favs = $scope.feedsData.favouritesDictionary;
		$scope.onFeedsDrag = function (index) {
			dashboardService.displayLoading();
			$scope.feeds.splice(index, 1);
			feedsService.setFeedsOrder().then(function (resp) {
				dashboardService.hideLoading();
			});
		}
		$scope.IgnoreDoubleClick = function () {
		    return false;
		}
		$scope.onFavsDrag = function (index) {
			dashboardService.displayLoading();
			$scope.favs.splice(index, 1);
			feedsService.setFavsOrder().then(function (resp) {
				dashboardService.hideLoading();
			});
		}
		$scope.getAll = function ($event) {
		    dashboardService.sidebar = false;
			setArticlesType(angular.element($event.currentTarget).parent(), 'all');
			// if there is only one category and feed, return this feed articles
			if ($scope.feeds.length === 1 && $scope.feeds[0].feeds.length === 1) {
				articlesService.getArticlesByFeed($scope.feeds[0].feeds[0]).then(function () {
					$state.go("dashboard." + dashboardService.getViewMode());
				});
			} else {
				articlesService.getAllArticles().then(function () {
					$state.go("dashboard." + dashboardService.getViewMode());
				});
			}
		}
		$scope.getByFeed = function ($event, feed) {
		    dashboardService.sidebar = false;
			setArticlesType(angular.element($event.currentTarget).parent());
			articlesService.getArticlesByFeed(feed).then(function () {
				$state.go("dashboard." + dashboardService.getViewMode());
			});
		}
		$scope.getByCat = function ($event, cat, index) {
		    dashboardService.sidebar = false;
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
				articlesService.getArticlesByFeed($scope.feeds[arguments[2]].feeds[0]).then(function () {
					$state.go("dashboard." + dashboardService.getViewMode());
				});
			} else {
				articlesService.getArticlesByCat(arguments[1]).then(function () {
					$state.go("dashboard." + dashboardService.getViewMode());
				});
			}
		}
		$scope.shevronToggle = function ($event) {
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
		    dashboardService.sidebar = false;
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
		$scope.toAddFeed = function () {
		    dashboardService.sidebar = false;
		    $state.go("dashboard.addFeed", { reload: true });
		}
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