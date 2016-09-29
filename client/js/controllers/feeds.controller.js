(function () {
	'use strict';
	angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$stateParams', '$http', 'toasterService', 'feedsService', 'dashboardService', 'articlesService', 'authService', function ($scope, $state, $stateParams, $http, toasterService, feedsService, dashboardService, articlesService, authService) {
		var changeCatObj = {};

		$scope.advicedCategory = $stateParams.category;
		$scope.obj = {};
		$scope.feeds = feedsService.feedsDictionary;
		$scope.adviced = feedsService.advicedDictionary;
		$scope.categories = feedsService.allCategories;
		$scope.addingNewCategory = false;
		$scope.newCategory = {};

		if ($state.current.name === 'dashboard.addFeed' || $state.current.name === 'dashboard.adviced') {
		    dashboardService.isReadingArticle = true;
		}

		if ($state.current.name === 'dashboard.adviced') {
		    var invalidCategory = $scope.adviced.filter(function (elem, i) {
		        return elem.category == $stateParams.category;
		    });
		    if (!invalidCategory.length) {
		        $state.go('404', { reload: true });
		    }
		}

		$scope.getFirstArticle = function (id) {
			for (var i = 0, array = articlesService.articles; i < array.length; i++) {
				if (array[i].feed == id) {
					return array[i];
				}
			}
		}

		$scope.IgnoreDoubleClick = function () {
			return false;
		}

		$scope.checkIfNew = function () {
			if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.addingNewCategory = true;
			}
			else {
				$scope.addingNewCategory = false;
				$scope.newCategory = {};
			}
		}

		$scope.addFeed = function () {
			$scope.error = '';
			if (!$scope.obj.link) {
				$scope.error = 'Enter Rss feed link';
				return;
			}
			if ($scope.newCategory.category) {
				$scope.obj.category = $scope.newCategory.category;
			}
			if (!$scope.obj.category) {
				if (!$scope.advicedCategory) {
					$scope.error = 'Choose category';
					return;
				}
			}
			if (!$scope.newCategory.category && $scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.error = 'Enter new category name';
				return;
			}
			if (!$scope.obj.category) {
				$scope.obj.category = $scope.advicedCategory;
			}
			feedsService.addFeed($scope.obj)
				.then(function (res) {
					$scope.addingNewCategory = false;
					toasterService.success('Feed successfully added');
					var feedId = res.data._id;
					feedsService.getAllFeeds().then(function (res) {
						$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: feedId });
					});

				}, function (err) {
					if (typeof err === 'string') {
						$scope.error = err;
					}
					if (err.data) {
						changeCatObj = {
							id: err.data.id,
							category: err.data.category,
							newCategory: $scope.obj.category
						};
						toasterService.confirm({
							message: 'Switch category?',
							confirm: 'switchCategory'
						}, $scope);
					}
					if (!err.data) {
						if (err.message) {
							$scope.error = err.message;
						}
					}
					else {
						$scope.error = err.data.message;
					}
				});
		}

		$scope.switchCategory = function () {
		    feedsService.switchCategory(changeCatObj);
		}

		$scope.toAdvicedCategory = function (cat) {
		    $state.go('dashboard.adviced', { category: cat });
		}

		$scope.addFeedByAdvice = function (feed) {
			$scope.addingNewCategory = false;
			$scope.obj.link = feed.rsslink;
			$scope.error = null;
			$scope.obj.category = '';
			$scope.modalShown = !$scope.modalShown;
		}

		$scope.setCoverImage = function (item) {
			var coverImage = '';
			switch (item.category) {
				case 'IT': {
					coverImage = '/assets/images/it.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case 'Gaming': {
					coverImage = '/assets/images/gaming.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case 'News': {
					coverImage = '/assets/images/news.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case 'Sport': {
					coverImage = '/assets/images/sport.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case 'Food': {
					coverImage = '/assets/images/food.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
			}
		}

		$scope.readArticle = function (article) {
			$state.go('dashboard.article', { feed: article.feed, link: article.link });
		}

		$scope.addPopular = function () {
		    $scope.modalShown = !$scope.modalShown;
		}
	}]);
})();