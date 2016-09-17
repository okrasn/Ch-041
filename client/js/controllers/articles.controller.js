(function () {
	'use strict';
	angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', '$stateParams', 'toasterService', 'dateFilter', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, $stateParams, toasterService, dateFilter, feedsService, articlesService, dashboardService) {
		$scope.articleData = articlesService;
		$scope.obj = {};
		$scope.newCategory = {};
		$scope.categories = feedsService.allFavsCategories;
		$scope.error = null;
		$scope.modalShown = false;
		$scope.articles = $scope.articleData.articles;
		$scope.adviced = $scope.articleData.advicedArticles;
		$scope.isFavourites = $scope.articleData.checkIfFavourites;
		$scope.favForAdd = null;
		$scope.favForRemove = null;
		$scope.articleForShare = null;
		$scope.articleForRead = null;
		$scope.addingNewFavCategory = false;

		if ($stateParams.feed && $stateParams.link) {
			dashboardService.isReadingArticle = true;
			articlesService.setReadArticle($scope, $stateParams.feed, $stateParams.link);
		}
		else {
			dashboardService.isReadingArticle = false;
			if (feedsService.feedsDictionary.length < 1 && !$scope.isFavourites()) {
				$state.go("dashboard.addFeed");
			}
		}

		$scope.checkIfFavourites = function (article) {
		    if (!article) {
		        return false;
		    }
		    if ($scope.isFavourites()) {
		        return true;
		    }
		    for (var i = 0; i < feedsService.favouritesDictionary.length; i++) {
		        for (var j = 0; j < feedsService.favouritesDictionary[i].articles.length; j++) {
		            if (feedsService.favouritesDictionary[i].articles[j].link === article.link) {
		                return true;
		            }
		        }
		    }
		    return false;
		}

		$scope.loadMore = function () {
			$scope.articleData.totalDisplayed += $scope.articleData.displayedIncrement;
		};

		$scope.isAllDisplayed = function () {
			return $scope.articleData.totalDisplayed > $scope.articleData.articles.length;
		}

		$scope.getArticles = function () {
			return articlesService.articles;
		}

		$scope.getSortParam = function () {
			var sortParam = dashboardService.getSortParam();
			if (sortParam.type === 'feed') {
				return ['feed', 'date'];
			}
			return sortParam;
		}

		$scope.checkIfNew = function () {
			if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.addingNewFavCategory = true;
			}
			else {
				$scope.addingNewFavCategory = false;
				$scope.newCategory = {};
			}
		}
		
		$scope.addFavourite = function (article) {
			$scope.error = null;
			$scope.modalShown = !$scope.modalShown;
			$scope.favForAdd = article;
		}
		
		$scope.confirmAddFavourite = function () {
			$scope.error = '';
			if ($scope.newCategory.category) {
				$scope.obj.category = $scope.newCategory.category;
			}
			if ($scope.obj.category) {
				if (!$scope.newCategory.category && $scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
					$scope.error = "Enter new category name";
					return;
				}
			}
			$scope.favForAdd.category = $scope.obj.category;
			articlesService.addFavourite($scope.favForAdd).then(function (res) {
			    $scope.resetAddFavValues();
			    $scope.cancelAddFavourite();
				toasterService.success("Article marked as favourite");
			}, function (err) {
			    $scope.resetAddFavValues();
				console.log(err);
				if (!err.data)
					$scope.error = err.message;
				else $scope.error = err.data.message;
			});
		}

		$scope.resetAddFavValues = function () {
		    dashboardService.hideLoading();
		    $scope.newCategory = {};
		    $scope.obj = {};
		    $scope.addingNewFavCategory = false;
		}

		$scope.cancelAddFavourite = function () {
			$scope.modalShown = false;
			$scope.favForAdd = {};
			$scope.newCategory = {};
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
			if (!date) {
				return;
			};
			return dateFilter(new Date(date), "dd/MM/yy HH:mm");
		}

		$scope.readArticle = function (article) {
			$state.go("dashboard.article", {feed: article.feed, link: article.link});
		}
	}]);
})();