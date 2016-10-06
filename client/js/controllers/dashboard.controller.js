(function () {
	'use strict';
	angular.module('rssreader').controller('DashboardController', ['$rootScope', '$scope', '$state', 'dashboardService', 'articlesService', 'feedsService', 'toasterService', function ($rootScope, $scope, $state, dashboardService, articlesService, feedsService, toasterService) {
	    $scope.dashboardData = dashboardService;
		$scope.sidebar = dashboardService.checkSidebar;
		$scope.feed = dashboardService.getFeed;
		$scope.alertMsg = dashboardService.alertMsg;
		$scope.successMsg = dashboardService.successMsg;
		$scope.readSingleFeed = dashboardService.readSingleFeed;
		$scope.hideSortList = dashboardService.hideSortList;
		$scope.isFavourites = articlesService.isFavourites;
		$scope.multiDelete = dashboardService.multiDelete;
		$scope.allSelected = false;
		var selectAllFlag = false;

		$scope.checkIfReading = function () {
			return dashboardService.isReadingArticle;
		};

		$scope.toggleSidebar = function () {
			dashboardService.sidebar = !dashboardService.sidebar;
		}

		$scope.hideSidebar = function () {
			dashboardService.sidebar = false;
		}

		$scope.showSidebar = function () {
			dashboardService.sidebar = true;
		}

		$scope.checkIfToggled = function (mode) {
			return dashboardService.getViewMode() === mode;
		}
		
		$scope.checkSortType = function (type, order) {
			var sortType = dashboardService.getSortParam();
			if (type == sortType.type && order == sortType.order) {
				return true;
			}
			return false;
		}
		
		$scope.onViewChange = function (view) {
			switch (view) {
				case 'view-mode1':
					dashboardService.setViewMode(0);
					break;
				case 'view-mode2':
					dashboardService.setViewMode(1);
					break;
				case 'view-mode3':
					dashboardService.setViewMode(2);
					break;
			}
			$state.go('dashboard.' + dashboardService.getViewMode(), { type: $state.params.type, value1: $state.params.value1, value2: $state.params.value2});
		}

		$scope.selectAll = function () {
		    if (articlesService.isFavourites.value) {
		        for (var i = 0, array = articlesService.articles; i < array.length; i++) {
		            if ($scope.allSelected) {
		                articlesService.favsToDelete[array[i]._id] = true;
		            }
		            else {
		                delete articlesService.favsToDelete[array[i]._id];
		            }
		        }
		    }
		}

		$scope.askMultiDelete = function () {
		    if (!Object.keys(articlesService.favsToDelete).length) {
		        toasterService.info("Select one ore more");
		        return;
		    };
		    toasterService.confirm({
		        message: "Remove selected articles?",
		        confirm: "confirmMultiDelete"
		    }, $scope);
		}

		$scope.confirmMultiDelete = function () {
		    dashboardService.displayLoading();
		    articlesService.removeMultiFavourites().finally(function () {
		        dashboardService.hideLoading();
		        $state.reload();
		    });
		}

		$scope.onFeedDelete = function () {
		    if (articlesService.isFavourites.value) {
		        $scope.allSelected = false;
		        dashboardService.multiDelete.value = !dashboardService.multiDelete.value;
		        if (!dashboardService.multiDelete.value) {
		            for (var member in articlesService.favsToDelete) {
		                delete articlesService.favsToDelete[member];
		            }
		        }
		        return;
		    }
			toasterService.confirm({
				message: "Remove this feed?",
				confirm: "confirmFeedDelete"
			}, $scope);
		}

		$rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
		    dashboardService.multiDelete.value = false;
		    for (var member in articlesService.favsToDelete) {
		        delete articlesService.favsToDelete[member];
		    }
		});

		$scope.confirmFeedDelete = function () {
			dashboardService.displayLoading();
			feedsService.removeFeed(dashboardService.getFeed()._id)
				.then(function (res) {
					toasterService.info("Feed has been deleted");
					$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all' }, { reload: true });
					return res;
				}, function (err) {
					console.log(err);
					return err;
				}).finally(function () {
					dashboardService.hideLoading();
				});
		}

		$scope.currentSortTitle = function () {
			var sortParam = dashboardService.getSortParam();
			switch (sortParam.type) {
				case 'date': {
					if (sortParam.order == 1){
						return "Newest";
					}
					return "Oldest";
				}
				case 'feed': {
					return "By Feed";            
				}
			}
		}

		var sortTypeElement;

		$scope.setSortParam = function (e, type, order) {
			if (sortTypeElement) {
				sortTypeElement.removeClass('selected');
			}
			sortTypeElement = angular.element(e.currentTarget);
			sortTypeElement.addClass('selected');
			dashboardService.setSortParam(type, order);
		}
	}]);
})();