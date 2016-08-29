(function () {
	'use strict';
	angular.module('rssreader', ['ui.router', 'ngAnimate', 'ngValidate', 'ngFileUpload', 'ngTouch', 'favicon', 'dndLists', 'satellizer', 'angular-jwt', 'toastr', '720kb.socialshare', 'ui.bootstrap'])
		.config(['$stateProvider', '$urlRouterProvider', '$authProvider', function ($stateProvider, $urlRouterProvider, $authProvider) {
		    $urlRouterProvider.otherwise('home');
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: './partials/home.html',
					controller: 'HomeController'
				})
				.state('login', {
					url: '/login',
					templateUrl: './partials/auth/login.html',
					controller: 'AuthController',
					onEnter: ['$state', 'authService', function ($state, authService) {
						if (authService.isLoggedIn()) {
							$state.go('home');
						}
					}]
				})
				.state('register', {
					url: '/register',
					templateUrl: './partials/auth/register.html',
					controller: 'AuthController',
					onEnter: ['$state', 'authService', function ($state, authService) {
						if (authService.isLoggedIn()) {
							$state.go('home');
						}
					}]
				})
				.state('profile', {
					url: '/profile',
					templateUrl: './partials/auth/profile.html',
					controller: 'ProfileController',
					onEnter: ['$state', 'authService', function ($state, authService) {
						if (!authService.isLoggedIn()) {
							authService.logOut();
							$state.go('home');
						}
					}]
				})
				.state("dashboard", {
					url: '/dashboard',
					views: {
						'': {
							templateUrl: './partials/dashboard/dashboard.html',
							controller: 'DashboardController'
						},
						'sidebar@dashboard': {
							templateUrl: './partials/dashboard/sidebar.html',
							controller: 'SidebarController'
						},
						'feedHead@dashboard': {
							templateUrl: './partials/dashboard/feed-head.html',
							controller: 'DashboardController'
						}
					},
					resolve: {
					    feedPromise: ['feedsService', function (feedsService) {
					        console.log("Resolve");

							return feedsService.getAllFeeds();
						}]
					},
					onEnter: ['articlesService', 'dashboardService', function (articlesService, dashboardService) {
					    //articlesService.getFavourites();
					    articlesService.getAllArticles();
					    //var type = dashboardService.getCurrentArticlesType();
					    //switch (type){
					    //    case 'all': {
					    //        articlesService.getAllArticles();
					    //    } 
					    //        break;
					    //    case 'category': {
					    //        articlesService.getArticlesByCat(dashboardService.currentArticlesValue);
					    //    } 
					    //        break;
					    //    case 'favourites': {
					    //        articlesService.getFavourites();
					    //    } 
					    //        break;
					    //}
					}]
				})
				.state("dashboard.list", {
					url: '/list',
					templateUrl: './partials/list/list.html',
					controller: 'ArticlesController'
				})
				.state("dashboard.th-list", {
					url: '/th-list',
					templateUrl: './partials/list/th-list.html',
					controller: 'ArticlesController'
				})
				.state("dashboard.th-large", {
					url: '/th-large',
					templateUrl: './partials/list/th-large.html',
					controller: 'ArticlesController'
				})
				.state("dashboard.addFeed", {
					url: '/add',
					templateUrl: './partials/dashboard/add-feed.html',
					controller: 'FeedsController',
					onEnter: ['dashboardService', function (dashboardService) {
						dashboardService.setTitle("Add Feed");
					}]
				});
			$authProvider.facebook({
				clientId: '173686319709284',
				name: 'facebook',
				url: '/auth/facebook',
				authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
				redirectUri: window.location.origin + '/',
				requiredUrlParams: ['display', 'scope'],
				scope: ['email'],
				scopeDelimiter: ',',
				display: 'popup',
				oauthType: '2.0',
				popupOptions: {
					width: 580,
					height: 400
				}
			});

			$authProvider.google({
				clientId: '806677097865-va2i3kq96mmu8i00t9k6q92ks1s9tg0l.apps.googleusercontent.com',
				url: '/auth/google',
				authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
				redirectUri: 'http://localhost:8080',
				requiredUrlParams: ['scope'],
				optionalUrlParams: ['display'],
				scope: ['profile', 'email'],
				scopePrefix: 'openid',
				scopeDelimiter: ' ',
				display: 'popup',
				oauthType: '2.0',
				popupOptions: {
					width: 452,
					height: 633
				}
			});
	}]);
})();
(function () {
    'use strict';
    angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'toasterService', 'dateFilter', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, toasterService, dateFilter, feedsService, articlesService, dashboardService) {
        $scope.obj = {};
        $scope.categories = feedsService.CATEGORIES;
        $scope.error = null;
        $scope.modalShown = false;
        $scope.articles = articlesService.articles;
        $scope.isFavourites = articlesService.checkIfFavourites;
        $scope.favForAdd = {};
        $scope.favForRemove = {};
        $scope.articleForShare = {};
        $scope.addFavourite = function (article) {
            $scope.error = null;
            $scope.modalShown = !$scope.modalShown;
            $scope.favForAdd = article;
        }
        $scope.confirmAddFavourite = function () {
            $scope.favForAdd.category = $scope.obj.category;
            articlesService.addFavourite($scope.favForAdd).then(function (res) {
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
            //$scope.modalShareShown = !$scope.modalShareShown;
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
(function() {
	'use strict';
	angular.module('rssreader').config(['$validatorProvider', function($validatorProvider) {
		$validatorProvider.addMethod("pattern", function(value, element) {
			return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{6,20}/.test(value);
		}, "Password must contain(a-z,A-Z,0-9,!@#)");
	}]).
	controller('AuthController', ['$scope', '$state', 'authService', '$window', 'dashboardService', '$auth', 'transfer', 'jwtHelper', 'toastr', function ($scope, $state, authService, $window, dashboardService, $auth, transfer, jwtHelper, toastr) {
		$scope.user = {};
		$scope.session;

		var ERRORS = {
			field_required: 'This field is required',
			email_example: 'Please, use example: jacksparrow@gmail.com',
			min_6symbl: 'Please, enter at least 6 characters',
			min_9symbl: 'Please, enter at least 9 characters',
			max_20symbl: 'Please, enter no more then 20 characters',
			reg_exp: 'Password must contain(a-z,A-Z,0-9,!@#)'
		}

		$scope.register = function (form) {
			if (form.validate()) {
				authService.register($scope.user).error(function (error) {
					$scope.error = error;
				}).then(function (response) {
					$state.go('dashboard.' + dashboardService.getViewMode(), {
						id: authService.userID()
					});
				});
			}
		};

		$scope.logIn = function (form) {
			if (form.validate()) {
				authService.logIn($scope.user, $scope.session).error(function (error) {
					$scope.error = error;
				}).then(function () {
					if (!$scope.session) {
						$scope.onExit = function () {
							auth.logOut();
						};
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
						toastr.success('You have successfully login');
						$window.onbeforeunload = $scope.onExit;
					} else {
						$state.go('dashboard.' + dashboardService.getViewMode(), {
							id: authService.userID()
						});
						toastr.success('You have successfully login');
					}
				});
			}
		};

		$scope.authenticate = function (provider) {
			$auth.authenticate(provider).then(function (response) {
				authService.saveToken(response.data.token);
				toastr.success('You have successfully authenticated');
				$state.go('dashboard.' + dashboardService.getViewMode(), {
					id: authService.userID()
				});
			})
		}

		$scope.validationLoginOptions = {
			rules: {
				mail: {
					required: true,
					email: true
				},
				pwd: {
					required: true
				}
			},
			messages: {
				mail: {
					required: ERRORS.field_required,
					email: ERRORS.email_example
				},

				pwd: {
					required: ERRORS.field_required
				}
			}
		};

		$scope.validationRegistrOptions = {
			rules: {
				mail: {
					required: true,
					email: true,
					minlength: 9,
					maxlength: 20,
				},
				pwd: {
					required: true,
					minlength: 6,
					maxlength: 20,
					pattern: true
				},
				reppwd: {
					required: true
				}
			},
			messages: {
				mail: {
					required: ERRORS.field_required,
					email: ERRORS.email_example,
					minlength: ERRORS.min_9symbl,
					maxlength: ERRORS.max_20symbl
				},

				pwd: {
					required: ERRORS.field_required,
					minlength: ERRORS.min_6symbl,
					maxlength: ERRORS.max_20symbl,
					pattern: ERRORS.reg_exp
				},

				reppwd: {
					required: ERRORS.field_required
				}
			}
		}
	}]);
})();
(function () {
    'use strict';
    angular.module('rssreader').controller('DashboardController', ['$scope', '$state', 'dashboardService', 'feedsService', 'toasterService', function ($scope, $state, dashboardService, feedsService, toasterService) {
        if (feedsService.feedsDictionary.length > 0) {
            dashboardService.setTitle("All");
            $state.go('dashboard.' + dashboardService.getViewMode());
        } else {
            dashboardService.setTitle("Add Feed");
            $state.go('dashboard.addFeed');
        }
        $scope.loadingIcon = dashboardService.isLoading;
        $scope.sidebar = dashboardService.checkSidebar;
        $scope.toggleSidebar = function () {
            dashboardService.sidebar = !dashboardService.sidebar;
        }
        $scope.hideSidebar = function () {
            dashboardService.sidebar = false;
        }
        $scope.showSidebar = function () {
            dashboardService.sidebar = true;
        }
        $scope.headTitle = dashboardService.getTitle;
        $scope.feed = dashboardService.getFeedId;
        $scope.alertMsg = dashboardService.alertMsg;
        $scope.successMsg = dashboardService.successMsg;

        $scope.hideViewBtns = function () {
            if ($scope.headTitle() === "Add Feed" || feedsService.feedsDictionary.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        $scope.checkIfToggled = function (mode) {
            return dashboardService.getViewMode() === mode;
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
            $state.go('dashboard.' + dashboardService.getViewMode());
        }
        var timer;
        $scope.onFeedDelete = function () {
            toasterService.confirm({
                message: "Remove this feed?",
                confirm: "confirmFeedDelete"
            }, $scope);
        }
        $scope.confirmFeedDelete = function () {
            feedsService.removeFeed(dashboardService.getFeedId())
                .then(function (res) {
                    toasterService.info("Feed has been deleted");
                    $state.reload("dashboard");
                }, function (err) {
                    console.log(err);
                });
        }
    }]);
})();
(function () {
    'use strict';
    angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$http', 'toasterService', 'feedsService', 'dashboardService', 'articlesService', 'authService', function ($scope, $state, $http, toasterService, feedsService, dashboardService, articlesService, authService) {
        $scope.obj = {};
        $scope.feeds = feedsService.feedsDictionary;
        $scope.categories = feedsService.CATEGORIES;
        $scope.addingNewCategory = false;
        $scope.newCategory = null;
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
            if ($scope.newCategory) {
                $scope.obj.category = $scope.newCategory;
            }
            $scope.addingNewCategory = false;
            $scope.error = '';
            console.log($scope.obj);
            feedsService.addFeed($scope.obj)
                .then(function (res) {
                    toasterService.success("Feed successfully added");
                    $state.reload("dashboard");
                }, function (err) {
                    if (!err.data)
                        $scope.error = err.message;
                    else $scope.error = err.data.message;
                });
        }
    }]);
})();
(function () {
    'use strict';
    angular.module('rssreader').controller('HomeController', ['$scope', '$state', 'authService', 'dashboardService', 'feedsService', function ($scope, $state, authService, dashboardService, feedsService) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.currentUser = authService.currentUser;
        $scope.onFeeds = function () {
            if (authService.isLoggedIn()) {
                $state.go('dashboard.' + dashboardService.getViewMode(), {
                    id: authService.userID()
                });
            } else {
                $state.go('home');
            }
        }
        $scope.onFeeds();
        $scope.onRegister = function () {
            $state.go('register');
        }
        $scope.onLogin = function () {
            $state.go('login');
        }
    }]);
})();
(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', 'authService', '$window', 'themeService', function ($scope, authService, $window, themeService) {
		$scope.layout = themeService.getTheme;
		$scope.text = "some text";
    }]);
})();
(function () {
    'use strict';
    angular.module('rssreader').controller('NavbarController', ['$scope', '$state', 'authService', 'dashboardService', 'transfer', 'accountInfo', '$auth',
        function ($scope, $state, authService, dashboardService, transfer, accountInfo, $auth) {
            $scope.isLoggedIn = authService.isLoggedIn;
            $scope.isDashboard = function () {
                return /dashboard/.test($state.current.name);
            }
            $scope.currentUser = authService.currentUser;
            $scope.toggleSidebar = function () {
                dashboardService.sidebar = !dashboardService.sidebar;
            }
            $scope.hideSidebar = function () {
                dashboardService.sidebar = false;
            }
            $scope.logOut = function () {
                authService.logOut();
                $state.go("home");
            }
            $scope.onEmblem = function () {
                if (authService.isLoggedIn()) {
                    $state.go('dashboard.' + dashboardService.getViewMode(), {
                        id: authService.userID()
                    });
                } else {
                    $state.go("home");
                }
            }
            $scope.getProfile = function () {
                accountInfo.getProfile().then(function (response) {
                    if ($auth.isAuthenticated()) {
                        var lenght = response.data.user.length;
                        for (var i = 0; i < lenght; i++) {
                            if (response.data.user[i].email === $auth.getPayload().email) {

                                $scope.profile = response.data.user[i];
                            }
                        }
                        console.log($scope.profile);
                    }
                })
            };
            $scope.getProfile();
        }]);
})();
(function() {
    'use strict';
    angular.module('rssreader').config(['$validatorProvider', function($validatorProvider) {
        $validatorProvider.addMethod("pattern", function(value, element) {
            return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{6,20}/.test(value);
        }, "Please specify the correct domain for your documents");
    }]).controller('ProfileController', ['Upload', '$http', '$state', 'profileService', '$scope',
        'authService', '$window', 'themeService', 'dashboardService', '$auth', 'accountInfo', 'toastr',
        function (Upload, $http, $state, profileService, $scope,
        authService, $window, themeService, dashboardService, $auth, accountInfo, toastr) {

            $scope.getProfile = function () {
                accountInfo.getProfile().then(function (response) {
                    if($auth.isAuthenticated()){
                        var lenght = response.data.user.length;
                        for(var i = 0;i < lenght;i++){
                            if(response.data.user[i].email === $auth.getPayload().email){
                                $scope.profile = response.data.user[i];
                            }
                        }
                        console.log($scope.profile);
                    }
                })
            };
            $scope.getProfile();

            $scope.link = function(provider) {
                $auth.link(provider).then(function() {
                toastr.info('You have successfully linked a ' + provider + ' account');
                $scope.getProfile();
                });
            };
            
            $scope.unlink = function(provider) {
                $auth.unlink(provider).then(function() {
                    toastr.info('You have unlinked a ' + provider + ' account');
                    $scope.getProfile();
                })
 
            };
            $scope.updateProfile = function(){
                $scope.getProfile();    
            };

            $scope.currentUser = authService.currentUser();
            $scope.newUserData = {
                email: authService.currentUser(),
                currentPass: "",
                newPass: "",
                newPassRepeat: ""
            }

            $scope.submit = function() { //function to call on form submit
                if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
                    $scope.upload($scope.file); //call upload function
                }
            };

            $scope.upload = function(file) {
                console.log($scope.file);
                Upload.upload({
                    url: 'http://localhost:8080/upload', //webAPI exposed to upload the file
                    data: { file: file } //pass file as data, should be user ng-model
                }).then(function(resp) { //upload function returns a promise
                    if (resp.data.error_code === 0) { //validate success
                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    } else {
                        $window.alert('an error occured');
                    }
                }, function(resp) { //catch error
                    console.log('Error status: ' + resp.status);
                    $window.alert('Error status: ' + resp.status);
                }, function(evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            };

            var PROFILE_ERRORS = {
                field_required: 'This field is required',
                email_example: 'Please, use example: jacksparrow@gmail.com',
                min_6symbl: 'Please,enter at least 6 characters',
                min_9symbl: 'Please,enter at least 9 characters',
                max_20symbl: 'Please,no more then 20 characters',
                reg_exp: 'Password must contain(a-z,A-Z,0-9,!@#)'
            };

            $scope.changePass = function(form) {
                if (form.validate()) {
                    console.log("Submit change password");
                    return $http.post('/changePassword', $scope.newUserData, {
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken()
                        }
                    }).success(function(data) {
                        authService.saveToken(data.token);
                        $state.go('dashboard.' + dashboardService.getViewMode(), {
                            id: authService.userID()
                        });
                    }).error(function(err) {
                        $scope.err = err;
                        console.log(err.message);
                    });
                }
            };

            $scope.changePassValidation = {
                rules: {
                    currentPassword: {
                        required: true
                    },
                    newPassword: {
                        required: true,
                        minlength: 6,
                        maxlength: 20,
                        pattern: true
                    },
                    repeatNewPassword: {
                        required: true
                    }
                },
                messages: {
                    currentPassword: {
                        required: PROFILE_ERRORS.field_required,
                        email: PROFILE_ERRORS.email_example,
                        minlength: PROFILE_ERRORS.min_9symbl,
                        maxlength: PROFILE_ERRORS.max_20symbl
                    },
                    newPassword: {
                        required: PROFILE_ERRORS.field_required,
                        minlength: PROFILE_ERRORS.min_6symbl,
                        maxlength: PROFILE_ERRORS.max_20symbl,
                        pattern: PROFILE_ERRORS.reg_exp
                    },
                    repeatNewPassword: {
                        required: PROFILE_ERRORS.field_required
                    }
                }
            };

            $scope.updateTheme = function() {
                themeService.layout = $scope.layout;
                console.log("Theme update");
                console.log("Theme:" + themeService.layout);
            };

            $scope.layout = themeService.layout;
            $scope.layouts = themeService.layouts;
        }
    ]);
})();
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
            setArticlesType(angular.element($event.currentTarget).parent(), "feed");
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
            if ($scope.feeds[arguments[2]].values.length == 1) {
                articlesService.getArticlesByFeed($scope.feeds[arguments[2]].values[0]);
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
        $scope.getFavArticle = function (article) {
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
angular.module('rssreader').directive('modal', [function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            scope.modalStyle = {};

            scope.hideModal = function () {
                scope.show = false;
            };
        },
        templateUrl: '../partials/modals/modal.html'
    };
}]);
angular.module('rssreader').directive('pwCheck', [function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function() {
                    scope.$apply(function() {
                        if (elem.val() === "") {
                            return;
                        }
                        var v = elem.val() === $(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        }
    }]);
angular.module('rssreader').directive('checkStrength', function() {
        return {
            replace: false,
            restrict: 'EACM',
            link: function(scope, iElement, iAttrs) {
                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    mesureStrength: function(p) {
                        var _force = 0,
                         _regex = /[#@$-/:-?-~!"^_`]/g,
                         _lowerLetters = /[a-z]+/.test(p),
                         _upperLetters = /[A-Z]+/.test(p),
                         _numbers = /[0-9]+/.test(p),
                         _symbols = _regex.test(p),
                         _flags = [_lowerLetters, _upperLetters, _numbers, _symbols],
                         _passedMatches = $.grep(_flags, function(el) {
                            return el === true; }).length;

                        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                        _force += _passedMatches * 10;

                        // penality (short password)
                        _force = (p.length <= 5) ? Math.min(_force, 10) : _force;
                        // penality (poor variety of characters)
                        _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                        _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                        _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                        return _force;
                    },
                    getColor: function(s) {
                        var idx = 0;
                        if (s <= 10) { idx = 0; } else if (s <= 20) { idx = 1; } else if (s <= 30) { idx = 2; } else if (s <= 40) { idx = 3; } else { idx = 4; }

                        return { idx: idx + 1, col: this.colors[idx] };
                    }
                };
                scope.$watch(iAttrs.checkStrength, function() {
                    if (scope.user.password === '') {
                        iElement.css({ "display": "none" });
                    } else {
                        var c = strength.getColor(strength.mesureStrength(scope.user.password));
                        iElement.css({ "display": "block" });
                        iElement.children('li')
                            .css({ "background": "#DDD" })
                            .slice(0, c.idx)
                            .css({ "background": c.col });
                    }
                });
            },
            template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
        };
    });
angular.module('rssreader').directive('toaster', ['$timeout', 'toasterService', function ($timeout, toasterService) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element, attrs) { 
            if (attrs.overlay) {
                scope.overlay = true;
            }
            else {
                scope.overlay = false;
            }
            if (attrs.delay) {
                scope.delay = attrs.delay;
            }
            else {
                scope.delay = 5000;
            }
            scope.toasterStyle = {};
            scope.confirm = function () {
                scope.$parent[attrs.confirm]();
                scope.hideToaster();
            }
            scope.reject = function () {
                scope.hideToaster();
            }
            scope.hideToaster = function () {
                $timeout.cancel(scope.timer);
                scope.$destroy();
                toasterService.removeToaster(element);
            };
            scope.timer = $timeout(function () {
                scope.hideToaster();
            }, scope.delay);
        },
        templateUrl: '../partials/modals/toaster.html'
    };
}]);

angular.module('rssreader')
	.factory('accountInfo', ['$http', function ($http) {
		return {
			getProfile: function () {
				return $http.get('/api/me');
			},
			updateProfile: function (profileData) {
				return $http.put('/api/me', profileData);
			}
		};
	}]);
(function () {
    'use strict';
    angular.module('rssreader').factory('articlesService', ['$http', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $q, authService, $timeout, dashboardService, feedsService) {
        var ARTICLES_NUM = 50,
            obj = {
                articles: [],
                isFavourites: false,
                checkIfFavourites: function () {
                    return obj.isFavourites;
                },
                getAllArticles: function () {
                    obj.isFavourites = false;
                    obj.articles.length = 0;
                    dashboardService.setTitle("All");
                    dashboardService.resetFeedId();
                    angular.forEach(feedsService.feedsDictionary, function (value, key) {
                        angular.forEach(value.values, function (value, key) {
                            return fetchArticles(value);
                        });
                    });
                },
                getArticlesByFeed: function (feed) {
                    obj.articles.length = 0;
                    obj.isFavourites = false;
                    dashboardService.setTitle(feed.title);
                    dashboardService.setFeedId(feed._id);
                    fetchArticles(feed);
                },
                getArticlesByCat: function (cat) {
                    obj.isFavourites = false;
                    obj.articles.length = 0;
                    dashboardService.setTitle(cat);
                    dashboardService.resetFeedId();
                    angular.forEach(feedsService.feedsDictionary, function (value, key) {
                        if (value.key === cat) {
                            angular.forEach(value.values, function (value, key) {
                                fetchArticles(value);
                            });
                        }
                    });
                },
                getFavourites: function () {
                    obj.isFavourites = true;
                    obj.articles.length = 0;
                    dashboardService.setTitle("Favourites");
                    dashboardService.resetFeedId();
                    angular.forEach(feedsService.favouritesDictionary, function (value, key) {
                        angular.forEach(value.values, function (value, key) {
                            obj.articles.push(value);
                        });
                    });
                },
                getFavArticlesByCat: function (cat) {
                    obj.isFavourites = true;
                    obj.articles.length = 0;
                    dashboardService.setTitle("Favourites: " + cat);
                    dashboardService.resetFeedId();
                    angular.forEach(feedsService.favouritesDictionary, function (value, key) {
                        if (value.key === cat) {
                            angular.forEach(value.values, function (value, key) {
                                obj.articles.push(value);
                            });
                        }
                    });
                },
                getFavArticle: function (article) {
                    obj.isFavourites = true;
                    dashboardService.setTitle("Favourites");
                    dashboardService.resetFeedId();
                    obj.articles.length = 0;
                    obj.articles.push(article);
                },
                addFavourite: function (article) {
                    return $http.post('/users/' + authService.userID() + '/addFavArticle', article, {
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken()
                        }
                    });
                },
                removeFavourite: function (article) {
                    dashboardService.loadingIcon = true;
                    return $http.delete('/users/' + authService.userID() + '/deleteFavFeed/' + article._id, {
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken()
                        }
                    }).then(function (res) {
                        dashboardService.loadingIcon = false;
                    });
                },
                getArticlesFetcher: function () {
                    return fetchArticles;
                }
            },
            getImage = function (item, format) {
                var source = "";
                if (format === "RSS") {
                    if (!item.getElementsByTagName('enclosure').length) {
                        try {
                            source = $(item).find('media\\:content, content')[0].getAttribute('url');
                        } catch (err) {
                            source = "";
                        }
                        if (source == "" || source == undefined) {
                            try {
                                var content = document.createElement('div');
                                content.innerHTML = item.getElementsByTagName('description')[0].textContent;
                                source = $(content).find('img')[0].src;
                            } catch (err) {
                                source = "";
                            }
                        }
                    } else {
                        source = item.getElementsByTagName('enclosure')[0].getAttribute('url');
                    }
                } else if (format === "ATOM") {
                    if (!item.getElementsByTagName('enclosure').length) {
                        try {
                            var content = document.createElement('div');
                            content.innerHTML = item.getElementsByTagName('content')[0].textContent;
                            source = $(content).find('img')[0].src;
                        } catch (err) {
                            source = "";
                        }
                    }
                }
                return source;
            },
            getContent = function (item, format) {
                var content = "";
                if (format === "RSS") {
                    try {
                        content = document.createElement('div');
                        content.innerHTML = item.getElementsByTagName('description')[0].textContent;
                        content = $(content).text();
                    } catch (err) { }
                } else if (format === "ATOM") {
                    content = $(item.getElementsByTagName('content')[0].childNodes[0].data).text();
                }
                return content;
            },
            fetchArticles = function (feed) {
                return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + ARTICLES_NUM + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSONP&callback=JSON_CALLBACK&output=xml")
                    .then(function (response) {
                        var parser = new DOMParser(),
                            xmlDoc = parser.parseFromString(response.data.responseData.xmlString, "text/xml"),
                            items = [];
                        if (feed.format === "RSS") {
                            items = xmlDoc.getElementsByTagName('item');
                            for (var i = 0; i < items.length; i++) {
                                var articleObj = {
                                    title: items[i].getElementsByTagName('title')[0].innerHTML,
                                    link: items[i].getElementsByTagName('link')[0].textContent,
                                    img: getImage(items[i], feed.format),
                                    content: getContent(items[i], feed.format),
                                    date: items[i].getElementsByTagName('pubDate')[0].textContent
                                };
                                articleObj.content = articleObj.content || articleObj.title;
                                obj.articles.push(articleObj);
                            }
                        } else if (feed.format === "ATOM") {
                            items = xmlDoc.getElementsByTagName('entry');
                            for (var i = 0; i < items.length; i++) {
                                var articleObj = {
                                    title: items[i].getElementsByTagName('title')[0].textContent,
                                    link: items[i].getElementsByTagName('id')[0].textContent,
                                    img: getImage(items[i], feed.format),
                                    content: getContent(items[i], feed.format),
                                    date: items[i].getElementsByTagName('published')[0].textContent
                                };
                                articleObj.content = articleObj.content || articleObj.title;
                                obj.articles.push(articleObj);
                            }
                        }
                        return response.data;
                    });
            }
        return obj;
    }]);
})();
(function () {
    'use strict';
    angular.module('rssreader').factory('authService', ['$http', '$window', '$auth', 'transfer', 'jwtHelper', function ($http, $window, $auth, transfer, jwtHelper) {
        var auth = {
            saveToken: function (token) {
                $auth.setToken(token);
            },
            getToken: function () {
                return $auth.getToken();
            },
            isLoggedIn: function () {
                return $auth.isAuthenticated();
            },
            currentUser: function () {
                if (auth.isLoggedIn()) {
                    return $auth.getPayload().email;
                }
            },
            userID: function () {
                if (auth.isLoggedIn()) {
                    var payload = $auth.getPayload();
                    console.log(payload);
                    return payload.sub;
                }
            },
            register: function (user) {
                return $http.post('/register', user).success(function (data) {
                    auth.saveToken(data.token);
                }).error(function (err) {
                    console.log(err.message);
                });
            },
            logIn: function (user) {
                return $http.post('/login', user).success(function (data) {
                    auth.saveToken(data.token);
                }).error(function (err) {
                    console.log(err.message);
                });
            },
            logOut: function () {
                $auth.removeToken();
                $auth.logout();
            }
        }
        return auth;
    }]);
})();
angular.module('rssreader').service('dashboardService', ['$window', function ($window) {
    var that = this;
    this.DEFAULT_VIEW = 2;

    this.currentArticlesType = 'all';
    this.currentArticlesValue = $window.localStorage.category;

    if (!$window.localStorage.articlesType) {
        $window.localStorage.articlesType = that.currentArticlesType;
    }

    if ($window.localStorage.category) {
        console.log($window.localStorage.category);
        currentArticlesValue = $window.localStorage.category;
    }

    this.setCurrentArticlesType = function (type, value) {
        that.currentArticlesValue = null;
        that.currentArticlesType = type;
        $window.localStorage.articlesType = that.currentArticlesType;
        if (value) {
            that.currentArticlesValue = value;
            $window.localStorage.category = that.currentArticlesValue;
        }
    }
    this.getCurrentArticlesType = function () {
        that.currentArticlesType = $window.localStorage.articlesType;
        return that.currentArticlesType;
    }
    if (!$window.localStorage.viewMode) {
        $window.localStorage.viewMode = this.DEFAULT_VIEW;
    }
    this.loadingIcon = false;
    this.isLoading = function () {
        return that.loadingIcon;
    };
    this.sidebar = false;
    this.checkSidebar = function () {
        return that.sidebar;
    }
    this.currentViewMode = $window.localStorage.viewMode;
    this.modalShown = false;
    this.viewModes = [
        'list',
        'th-list',
        'th-large'
    ];
    this.resetViewMode = function () {
        $window.localStorage.viewMode = this.DEFAULT_VIEW;
    }
    this.setViewMode = function (index) {
        $window.localStorage.viewMode = index;
        if (index > that.viewModes.length - 1) {
            throw new Error("View mode you are trying to set is not defined");
        } else {
            that.currentViewMode = $window.localStorage.viewMode;
        }
    }
    this.getViewMode = function () {
        that.currentViewMode = $window.localStorage.viewMode;
        return that.viewModes[that.currentViewMode];
    }
    this.title = "";
    this.setTitle = function (title) {
        if (title == "Add Feed") {
            this.resetFeedId();
        }
        that.title = title;
    }
    this.getTitle = function () {
        return that.title;
    }

    this.currentFeed = '';
    this.getFeedId = function () {
        return that.currentFeed;
    }
    this.setFeedId = function (id) {
        that.currentFeed = id;
    }
    this.resetFeedId = function () {
        that.currentFeed = '';
    }
}]);
angular.module('rssreader').service('feedsService', ['$http', '$state', 'authService', 'dashboardService', function ($http, $state, authService, dashboardService) {
    that = this;
    this.feedsDictionary = [];
    this.favouritesDictionary = [];
    this.allArticles = [];
    this.CATEGORIES = ["News", "IT", "Sport", "Design", "Movies", "Music", "Culture", "Nature", "Economics", "Science", "Custom"];
    this.getAllFeeds = function () {
        return $http.get('/users/' + authService.userID(), {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            angular.copy(res.data, that.feedsDictionary);
            that.getAllFavourites().then(function (res) {
                angular.copy(res.data, that.favouritesDictionary);
            });
        });
    }
    this.getAllFavourites = function () {
        return $http.get('/users/' + authService.userID() + "/favourites", {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
    var checkRssFormat = function (xmlDoc) {
        //Determine if RSS
        if (xmlDoc.getElementsByTagName('rss').length) {
            return 'RSS';
            //Determine if ATOM
        } else if (xmlDoc.getElementsByTagName('feed').length) {
            return 'ATOM';
        }
        return -1;
    }
    var generateFeed = function (doc, feed, format) {
        var feedObj = {};
        if (format === 'RSS') {
            var channel = doc.getElementsByTagName('channel')[0];
            feedObj.title = channel.getElementsByTagName('title')[0].childNodes[0].nodeValue;
            feedObj.description = channel.getElementsByTagName('description')[0].childNodes[0] ? channel.getElementsByTagName('description')[0].childNodes[0].nodeValue : '';
            feedObj.link = channel.getElementsByTagName("link")[0].childNodes[0].nodeValue;
            feedObj.rsslink = feed.link;
            feedObj.category = feed.category;
        } else if (format === 'ATOM') {
            feedObj.title = doc.getElementsByTagName('title')[0].childNodes[0].nodeValue;
            feedObj.description = '';
            feedObj.link = doc.getElementsByTagName('link')[0].getAttribute('href');
            feedObj.rsslink = feed.link;
            feedObj.category = feed.category;
        }
        feedObj.format = format;
        return feedObj;
    }
    this.getFeedGenerator = function () {
        return generateFeed;
    }
    this.getRssChecker = function () {
        return checkRssFormat;
    }
    this.addFeed = function (feed) {
        return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=" + encodeURIComponent(feed.link) + "&method=JSON&callback=JSON_CALLBACK&output=xml")
            .then(function (response) {
                if (feed.link === undefined) {
                    throw new Error("Enter Rss feed link");
                }
                if (feed.category === undefined) {
                    throw new Error("Choose category");
                }
                if (response.data.responseData === null) {
                    throw new Error("URL is incorrect or does not contain RSS Feed data");
                }
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(response.data.responseData.xmlString, "text/xml");
                var format = checkRssFormat(xmlDoc);
                if (format === -1) {
                    throw new Error("URL is incorrect or does not contain RSS Feed data");
                } else {
                    var feedObj = generateFeed(xmlDoc, feed, format);
                    return $http.post('/users/' + authService.userID() + '/addFeed', feedObj, {
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken()
                        }
                    });
                }
                return response.data;
            });
    }

    this.removeFeed = function (feedId) {
        return $http.delete('/users/' + authService.userID() + '/deleteFeed/' + feedId, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }

    this.setFeedsOrder = function () {
        var obj = {
            newCategories: []
        }
        for (var i = 0; i < that.feedsDictionary.length; i++) {
            obj.newCategories.push(that.feedsDictionary[i].key);
        }
        return $http.post('/users/' + authService.userID() + '/setCategoryOrder', obj, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }

    this.setFavsOrder = function () {
        var obj = {
            newCategories: []
        }
        for (var i = 0; i < that.favouritesDictionary.length; i++) {
            obj.newCategories.push(that.favouritesDictionary[i].key);
        }
        return $http.post('/users/' + authService.userID() + '/setFavsCategoryOrder', obj, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
}]);
(function () {
    'use strict';
    angular.module('rssreader')
        .service('profileService', ['$window', 'Upload',
      function ($window, Upload) {
}]);
})();
'use strict';
angular.module('rssreader').service('themeService', ['authService', '$window', function (authService, $window) {
    that = this;
    this.layout = 'style';
    this.getTheme = function () {
        return that.layout !== undefined ? that.layout : "style";
    }
    this.layouts = [
        {
            name: 'Blue',
            url: 'style'
        },
        {
            name: 'Black',
            url: 'style2'
        },
        {
            name: 'Grey',
            url: 'style3'
        }
    ];
}]);
(function () {
    'use strict';
    angular.module('rssreader').service('toasterService', ['$rootScope', '$compile', '$animate', function ($rootScope, $compile, $animate) {
        var domParent = angular.element('body');

        //********************************************************************************
        //  You can pass custom options to toaster methods as second parameter
        //  options properties:
        //  message: string
        //  overlay: boolean
        //  delay: value (ms)
        //  position: [left, right, left-bottom, right-bottom]
        //  type: one of ['toaster-default', 'toaster-success', 'toaster-info', 'toaster-error']
        //  iconClass: string (name of glyph class, ex: fa fa-info)
        //  confirm: Function (callback that will ba called if user confirm toaster action)
        // 
        //********************************************************************************

        var buildToaster = function (options, scope, onShow) {
            var callback = arguments[2],
                elem = angular.element(document.createElement("toaster"));
            elem.addClass('toaster-wrapper');
            elem.addClass(options.type);
            if (options.overlay) {
                elem.attr("overlay", options.overlay);
            }

            if (options.delay) {
                elem.attr("delay", options.delay);
            }

            if (options.confirm) {
                elem.attr("confirm", options.confirm);
            }
            var icon = angular.element(document.createElement("div"));
            icon.addClass('toaster-icon');
            icon.addClass(options.iconClass);
            elem.append(icon);

            elem.append("<span>" + options.message + "</span>");
            if (options.htmlContent) {
                elem.append("<span>" + options.htmlContent + "</span>");
            }
            var appendHtml;
            if (typeof arguments[1] === 'object') {
                appendHtml = $compile(elem, scope)(scope.$new());
            }
            else {
                appendHtml = $compile(elem, scope)($rootScope.$new());
            }
            $animate.enter(appendHtml, domParent).then(function () {
                if (typeof callback === 'function') {
                    onShow();
                }
            });
        }
        this.success = function (message, customOptions, scope, onShow) {
            var defaultOptions = {
                message: message,
                type: 'toaster-success',
                iconClass: 'fa fa-check',
                delay: 3000
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(options, scope, onShow);
        }
        this.info = function (message, customOptions, scope, onShow) {
            var defaultOptions = {
                message: message,
                type: 'toaster-info',
                iconClass: 'fa fa-info',
                delay: 3000
            },
            options;
            if (typeof arguments[1] === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(options, scope, onShow);
        }
        this.error = function (message, customOptions, scope, onShow) {
            var defaultOptions = {
                message: message,
                type: 'toaster-error',
                iconClass: 'fa fa-exclamation-triangle',
                delay: 3000
            },
            options;
            if (typeof arguments[1] === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(options, scope, onShow);
        }
        this.custom = function (customOptions, scope, onShow) {
            var defaultOptions = {
                message: message,
                type: 'toaster-default',
                overlay: true,
                iconClass: 'fa fa-info',
            },
            options;
            if (typeof arguments[0] === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(options, scope, onShow);
        }
        this.confirm = function (customOptions, scope, onShow) {
            var defaultOptions = {
                message: 'Confirm?',
                type: 'toaster-default',
                overlay: true,
                iconClass: 'fa fa-question',
                htmlContent: "<button class='app-btn-toaster-red' aria-label='Justify' ng-click='confirm()'>yes</button><button class='app-btn-toaster' aria-label='Justify' ng-click='reject()'>no</button>"
            },
            options;
            if (typeof customOptions === 'object') {
                options = angular.extend({}, defaultOptions, customOptions);
            }
            else {
                options = defaultOptions;
            }
            buildToaster(options, scope, onShow);
        }
        this.removeToaster = function (element) {
            $animate.leave(element, domParent).then(function () {
            });
        }
    }]);
})();
angular.module('rssreader')
  .factory('transfer', [function() {
	  var obj = {};
	  function setObj(data){
		  obj = data;
	  }
	  function getObj(){
		  return obj;
	  }
	  return {
		  
		  setObj : setObj,
		  getObj : getObj
	  }
    
    
  }]);