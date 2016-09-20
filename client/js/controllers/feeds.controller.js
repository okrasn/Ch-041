(function () {
	'use strict';
	angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$stateParams', '$http', 'toasterService', 'feedsService', 'dashboardService', 'articlesService', 'authService', function ($scope, $state, $stateParams, $http, toasterService, feedsService, dashboardService, articlesService, authService) {
		if ($state.current.name === 'dashboard.addFeed' || $state.current.name === 'dashboard.adviced') {
			dashboardService.isReadingArticle = true;
		}
		var changeCatObj = {};
		$scope.advicedCategory = $stateParams.category;
		$scope.obj = {};
		$scope.feeds = feedsService.feedsDictionary;
		$scope.adviced = feedsService.advicedDictionary;
		$scope.categories = feedsService.allCategories;
		$scope.addingNewCategory = false;
		$scope.newCategory = {};

		if ($state.current.name === "dashboard.adviced") {
			var invalidCategory = $scope.adviced.filter(function (elem, i) {
				return elem.category == $stateParams.category;
			});
			if (!invalidCategory.length) {
				$state.go("404", {reload: true});
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
			dashboardService.loadingIcon = true;
			$scope.error = '';
			if (!$scope.obj.link) {
				$scope.error = "Enter Rss feed link";
				dashboardService.loadingIcon = false;
				return;
			}
			if ($scope.newCategory.category) {
				$scope.obj.category = $scope.newCategory.category;
			}

			if (!$scope.obj.category) {
				if (!$scope.advicedCategory) {
					$scope.error = "Choose category";
					dashboardService.loadingIcon = false;
					return;
				}
			}

			if (!$scope.newCategory.category && $scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.error = "Enter new category name";
				dashboardService.loadingIcon = false;
				return;
			}
			if (!$scope.obj.category) {
				$scope.obj.category = $scope.advicedCategory;
			}
			feedsService.addFeed($scope.obj)
				.then(function (res) {
					$scope.addingNewCategory = false;
					toasterService.success("Feed successfully added");
					$state.go('dashboard.' + dashboardService.getViewMode(), {}, { reload: true });
				}, function (err) {
					dashboardService.loadingIcon = false;
					if (err.data.id) {
						changeCatObj = {
							id: err.data.id,
							category: err.data.category,
							newCategory: $scope.obj.category
						};

						toasterService.confirm({
							message: "Switch category?",
							confirm: "switchCategory"
						}, $scope);

					}
					if (!err.data)
						$scope.error = err.message;
					else $scope.error = err.data.message;
				});
		}
		$scope.switchCategory = function () {
			return $http.post('/users/' + authService.userID() + '/changeFeedCategory', changeCatObj, {
				headers: {
					Authorization: 'Bearer ' + authService.getToken()
				}
			}).success(function (res) {
			    console.log(res);
			    $state.go('dashboard.' + dashboardService.getViewMode(), {}, { reload: true });
			}
			).error(function (err) {
			    console.log(err);
			});
		}
		$scope.addFeedByAdvice = function (feed) {
			$scope.addingNewCategory = false;
			$scope.obj.link = feed.rsslink;
			$scope.error = null;
			$scope.obj.category = '';
			$scope.modalShown = !$scope.modalShown;
		}
		$scope.setCoverImage = function (item) {
			var coverImage = "";
			switch (item.category) {
				case "IT": {
					coverImage = '/assets/images/it.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case "Gaming": {
					coverImage = '/assets/images/gaming.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case "News": {
					coverImage = '/assets/images/news.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case "Sport": {
					coverImage = '/assets/images/sport.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
				case "Food": {
					coverImage = '/assets/images/food.jpeg'
					return { 'background-image': 'url(' + coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
				}
					break;
			}
		}
	}]);
})();