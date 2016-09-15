(function () {
	'use strict';
	angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$http', 'toasterService', 'feedsService', 'dashboardService', 'articlesService', 'authService', function ($scope, $state, $http, toasterService, feedsService, dashboardService, articlesService, authService) {
		$scope.obj = {};
		$scope.feeds = feedsService.feedsDictionary;
		$scope.categories = feedsService.allCategories;
		$scope.addingNewCategory = false;
		$scope.newCategory = null;
		if ($state.current.name === 'dashboard.addFeed') {
		    dashboardService.isReadingArticle = true;
		    console.log($state.current.name);
		}
		$scope.checkIfNew = function () {
			if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.addingNewCategory = true;
			}
			else {
				$scope.addingNewCategory = false;
				$scope.newCategory = null;
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
			if ($scope.newCategory) {
				$scope.obj.category = $scope.newCategory;
			}
			if (!$scope.obj.category) {
			    $scope.error = "Choose category";
			    dashboardService.loadingIcon = false;
				return;
			}
			if (!$scope.newCategory && $scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
			    $scope.error = "Enter new category name";
			    dashboardService.loadingIcon = false;
				return;
			}
			feedsService.addFeed($scope.obj)
				.then(function (res) {
					$scope.addingNewCategory = false;
					toasterService.success("Feed successfully added");
					$state.go('dashboard.' + dashboardService.getViewMode(), {}, { reload: true });
				}, function (err) {
				    dashboardService.loadingIcon = false;
					if (!err.data)
						$scope.error = err.message;
					else $scope.error = err.data.message;
				});
		}
	}]);
})();