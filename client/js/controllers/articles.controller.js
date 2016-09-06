(function () {
	'use strict';
	angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'toasterService', 'dateFilter', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, toasterService, dateFilter, feedsService, articlesService, dashboardService) {
		$scope.obj = {};
		$scope.newCatObj = {};
		$scope.categories = feedsService.allFavsCategories;
		$scope.error = null;
		$scope.modalShown = false;
		$scope.articles = articlesService.articles;
		$scope.isFavourites = articlesService.checkIfFavourites;
		$scope.favForAdd = {};
		$scope.favForRemove = {};
		$scope.articleForShare = {};
		$scope.sortParam = dashboardService.sortParam;
		$scope.addingNewFavCategory = false;

		$scope.getSortParam = function () {
			$scope.sortParam = dashboardService.sortParam;
			return $scope.sortParam;
		}
		$scope.checkIfNew = function () {
			if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.addingNewFavCategory = true;
			}
			else {
				$scope.addingNewFavCategory = false;
				$scope.newCatObj.category = null;
			}
		}

		$scope.addFavourite = function (article) {
			$scope.error = null;
			$scope.modalShown = !$scope.modalShown;
			$scope.favForAdd = article;
		}
		$scope.confirmAddFavourite = function () {
			if ($scope.newCatObj.category) {
				$scope.obj.category = $scope.newCatObj.category;
			}
			$scope.favForAdd.category = $scope.obj.category;
			articlesService.addFavourite($scope.favForAdd).then(function (res) {
				$scope.addingNewCategory = false;
				toasterService.success("Article marked as favourite");
				$state.reload("dashboard");
			}, function (err) {
				console.log(err);
				if (!err.data)
					$scope.error = err.message;
				else $scope.error = err.data.message;
			});
		}
		$scope.cancelAddFavourite = function () {
			$scope.modalShown = false;
			$scope.favForAdd = {};
		}
		$scope.share = function (article) {
			$scope.error = null;
			$scope.articleForShare = article;
		}
		$scope.cancelSharing = function () {
			$scope.modalShareShown = false;
			$scope.articleForShare = {};
		}
		$scope.removeFavourite = function (article) {
			$scope.favForRemove = article;
			toasterService.confirm({
				message: "Remove this article?",
				confirm: "confirmRemoveFavourite"
			}, $scope);
		}
		$scope.confirmRemoveFavourite = function () {
			articlesService.removeFavourite($scope.favForRemove).then(function (res) {
				toasterService.info("Article removed from favourites");
				$state.reload("dashboard");
			}, function (err) {
				console.log(err);
			});
		}
		$scope.getArticleDate = function (date) {
			return dateFilter(new Date(Date.parse(date)), "dd/MM/yy HH:mm");
		}
	}]);
})();