(function () {
	'use strict';
	angular.module('rssreader').factory('articlesService', ['$http', '$state', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $state, $q, authService, $timeout, dashboardService, feedsService) {
		var ARTICLES_NUM = 50,
			temp_articles = [],
			defer = $q.defer(),
			promises = [],
			obj = {
				articles: [],
				articleForRead: null,
				isFavourites: false,
				checkIfFavourites: function () {
					return obj.isFavourites;
				},
				setReadArticle: function ($scope, feed, link) {
					for (var i = 0; i < obj.articles.length; i++) {
						if (obj.articles[i].link === link) {
							$scope.articleForRead = obj.articles[i];
							return;
						}
					}
					return getFeedDataById(feed).success(function (res) {
						obj.resetArticles();
						var feedObj = res;
						return fetchArticles(feedObj).then(function (res) {
							for (var i = 0; i < temp_articles.length; i++) {
								if (temp_articles[i].link === link) {
									$scope.articleForRead = temp_articles[i];
								}
							}
							if (!$scope.articleForRead) {
								$state.go("404");
							}
						});
					}).catch(function (err) {
						obj.resetArticles();
						return getArticleDataByLink(link).then(function (res) {
							dashboardService.loadingIcon = false;
							$scope.articleForRead = res.data;
						}).catch(function (err) {
							dashboardService.loadingIcon = false;
							if (err.status === 404) {
								$state.go("404");
							}
						});
						if (err.status === 404) {
							$state.go("404");
						}
						else $state.go("dashboard." + dashboardService.getViewMode());
					});
				},
				getAllArticles: function () {
					obj.resetArticles();
					dashboardService.setTitle("All");
					angular.forEach(feedsService.feedsDictionary, function (value, key) {
						angular.forEach(value.feeds, function (value, key) {
							promises.push(fetchArticles(value));
						});
					});
					$q.all(promises).then(function () {
						obj.articles = temp_articles;
						dashboardService.loadingIcon = false;
					});

				},
				getArticlesByFeed: function (feed) {
					obj.resetArticles();
					dashboardService.setTitle(feed.title);
					dashboardService.setFeedId(feed._id);
					fetchArticles(feed).then(function () {
						obj.articles = temp_articles;
					});
				},
				getArticlesByCat: function (cat) {
					obj.resetArticles();
					dashboardService.setTitle(cat);
					angular.forEach(feedsService.feedsDictionary, function (value, key) {
						if (value.key === cat) {
							angular.forEach(value.feeds, function (value, key) {
								promises.push(fetchArticles(value));
							});
						}
					});
					$q.all(promises).then(function () {
						obj.articles = temp_articles;
					});
				},
				getFavourites: function () {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites");
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
						angular.forEach(value.feeds, function (value, key) {
							obj.articles.push(value);
						});
					});
					dashboardService.loadingIcon = false;
				},
				getFavArticlesByCat: function (cat) {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites: " + cat);
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
						if (value.key === cat) {
							angular.forEach(value.values, function (value, key) {
								obj.articles.push(value);
							});
						}
					});
					dashboardService.loadingIcon = false;
				},
				getFavArticle: function (article) {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites");
					obj.articles.push(article);
					dashboardService.loadingIcon = false;
				},
				addFavourite: function (article) {
					dashboardService.loadingIcon = true;
					return $http.post('/users/' + authService.userID() + '/addFavArticle', article, {
						headers: {
							Authorization: 'Bearer ' + authService.getToken()
						}
					}).then(function (res) {
						dashboardService.loadingIcon = false;
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
				resetArticles: function () {
					dashboardService.loadingIcon = true;
					temp_articles.length = 0;
					obj.articles.length = 0;
					obj.isFavourites = false;
					dashboardService.resetFeedId();
					promises.length = 0;
				},
				// Additional method for unit testing
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
									date: Date.parse(items[i].getElementsByTagName('pubDate')[0].textContent),
									feed: feed._id
								};
								articleObj.content = articleObj.content || articleObj.title;
								temp_articles.push(articleObj);
							}
						} else if (feed.format === "ATOM") {
							items = xmlDoc.getElementsByTagName('entry');
							for (var i = 0; i < items.length; i++) {
								var articleObj = {
									title: items[i].getElementsByTagName('title')[0].textContent,
									link: items[i].getElementsByTagName('id')[0].textContent,
									img: getImage(items[i], feed.format),
									content: getContent(items[i], feed.format),
									date: Date.parse(items[i].getElementsByTagName('published')[0].textContent),
									feed: feed._id
								};
								articleObj.content = articleObj.content || articleObj.title;
								temp_articles.push(articleObj);
							}
						}
						dashboardService.loadingIcon = false;
						return response.data;
					});
			},
			getFeedDataById = function (id) {
				return $http.post('/users/' + authService.userID() + '/getFeedData', { id: id }, {
					headers: {
						Authorization: 'Bearer ' + authService.getToken()
					}
				});
			},
			getArticleDataByLink = function (link) {
				return $http.post('/users/' + authService.userID() + '/getFavArticle', { link: link }, {
				    headers: {
				        Authorization: 'Bearer ' + authService.getToken()
				    }
				});
			}
		return obj;
	}]);
})();