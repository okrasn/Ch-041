(function () {
	'use strict';
	angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', '$window', '$stateParams', 'toasterService', 'dateFilter', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, $window, $stateParams, toasterService, dateFilter, feedsService, articlesService, dashboardService) {
		var queryTypes = ['all', 'category', 'feed', 'favourites'];
		analizeRouting();
		$scope.articleData = articlesService;
		$scope.obj = {};
		$scope.newCategory = {};
		$scope.categories = feedsService.allFavsCategories;
		$scope.error = null;
		$scope.modalShown = false;
		$scope.isFavourites = articlesService.checkIfFavourites;
		$scope.favForAdd = null;
		$scope.favForRemove = null;
		$scope.articleForShare = null;
		$scope.articleForRead = articlesService.articleForRead;
		$scope.addingNewFavCategory = false;
		$window.scrollTo(0, 0);
		$scope.checkIfFavourites = function (article) {
			if (!article) {
				return false;
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
		}

		$scope.isAllDisplayed = function () {
			return $scope.articleData.totalDisplayed > $scope.articleData.articles.length;
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
			$scope.addingNewFavCategory = false;
			$scope.error = null;
			$scope.modalShown = !$scope.modalShown;
			$scope.favForAdd = article;
			$scope.obj = {};
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

		$scope.removeFavourite = function (article, cat) {
		    $scope.favForRemove = article;
			toasterService.confirm({
				message: "Remove this article?",
				confirm: "confirmRemoveFavourite"
			}, $scope);
		}

		$scope.confirmRemoveFavourite = function () {
			articlesService.removeFavourite($scope.favForRemove).then(function (res) {
			    toasterService.info("Article removed from favourites");
				for (var i = 0, array = res.data; i < array.length; i++) {
				    if (array[i].category === $scope.favForRemove.category) {
				        if (array[i].articles.length > 0) {
				            articlesService.getFavArticlesByCat($stateParams.value2);
							return;
						}
						else {
							break;
						}
					}
				}
				if (!res.data.length) {
				    $state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all', value1: '', value2: '' });
				}
				else {
				    $state.go("dashboard." + dashboardService.getViewMode(), { type: "favourites", value1: '', value2: '' });
				}
			}, function (err) {
				console.log(err);
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

		$scope.getArticleDate = function (date) {
			if (!date) {
				return;
			};
			return dateFilter(new Date(date), "dd/MM/yy HH:mm");
		}

		$scope.readArticle = function (article, type) {
			articlesService.articleForRead = article;
			$state.go("dashboard.article", { feed: article.feed, link: article.link, type: type });
		}

		angular.element(document.body).bind('click', function (e) {
			var popups = document.querySelectorAll('.popover');
			if (popups) {
				for (var i = 0; i < popups.length; i++) {
					var popup = popups[i];
					var popupElement = angular.element(popup);
					if (popupElement[0].previousSibling != e.target) {
						popupElement.scope().$parent.isOpen = false;
						popupElement.scope().$parent.$apply();
					}
				}
			}
		});
		function analizeRouting() {
			var routeType = $stateParams.type;
			var exist = queryTypes.filter(function (elem, i, array) {
				return elem === routeType;
			});
			if (!routeType || !exist.length) {
				if ($stateParams.feed && $stateParams.link) {
					dashboardService.isReadingArticle = true;
					if (articlesService.articleForRead) {
						if ($stateParams.link === articlesService.articleForRead.link) {
							dashboardService.hideLoading();
							return;
						}
					}
					return articlesService.setReadArticle($stateParams.feed, $stateParams.link, $stateParams.type).then(function (res) {
						dashboardService.hideLoading();
						if (articlesService.articleForRead === null) {
							$state.go("404");
							return;
						}
						$scope.articleForRead = articlesService.articleForRead;
					}, function (err) {		                
						dashboardService.hideLoading();
						if (err.status === 404) {
							$state.go("404");
						}
					});
				}
				else {
					dashboardService.isReadingArticle = false;
					if (feedsService.feedsDictionary.length < 1) {
						$state.go("dashboard.addFeed");
					}
					else {
						$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all' });
					}
				}
			}
			else {
			    dashboardService.isReadingArticle = false;
				switch (routeType) {
					case 'all': {
						if (feedsService.feedsDictionary.length < 1) {
							$state.go("dashboard.addFeed");
						}
						else {
							articlesService.getAllArticles();
						}
					}
						break;
					case 'feed': {
					    feedsService.getSingleFeed($stateParams.value1).success(function (res) {
					        articlesService.getArticlesByFeed(res);
					    }).error(function (err) {
					        console.log(err);
					    });
					}
						break;
					case 'category': {
						articlesService.getArticlesByCat($stateParams.value1);
					}
						break;
				    case 'favourites': {
				        if ($stateParams.value1 === 'category' && $stateParams.value2) {
							articlesService.getFavArticlesByCat($stateParams.value2);
						}
						if (!$stateParams.value1 && !$stateParams.value2) {
							articlesService.getFavourites();
						}
					}
						break;
				}
			}
		}
	}]);
})();