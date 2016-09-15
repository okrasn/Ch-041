(function () {
	'use strict';
	String.prototype.replaceAll = function (target, replacement) {
		return this.split(target).join(replacement);
	};
	angular.module('rssreader').factory('articlesService', ['$http', '$state', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $state, $q, authService, $timeout, dashboardService, feedsService) {
		var ARTICLES_NUM = 50,
			temp_articles = [],
			defer = $q.defer(),
			promises = [],
			obj = {
				articles: [],
				articleForRead: null,
				isFavourites: false,
				displayedIncrement: 20,
				totalDisplayed: 20,
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
								obj.resetArticles();
								return getArticleDataByLink(link).then(function (res) {
									dashboardService.hideLoading();
									$scope.articleForRead = res.data;
								}).catch(function (err) {
									dashboardService.hideLoading();
									if (err.status === 404) {
										$state.go("404");
									}
								});
								if (err.status === 404) {
									$state.go("404");
								}
								else $state.go("dashboard." + dashboardService.getViewMode());
							}
						});
					}).catch(function (err) {
						obj.resetArticles();
						return getArticleDataByLink(link).then(function (res) {
							dashboardService.hideLoading();
							$scope.articleForRead = res.data;
						}).catch(function (err) {
							dashboardService.hideLoading();
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
					return $q.all(promises).then(function () {
					    obj.articles = temp_articles;
						dashboardService.hideLoading();
					});
				},
				getArticlesByFeed: function (feed) {
					obj.resetArticles();
					dashboardService.setTitle(feed.title);
					dashboardService.setFeedId(feed);
					return fetchArticles(feed).then(function () {
					    obj.articles = temp_articles;
					    dashboardService.hideLoading();
					});
				},
				getArticlesByCat: function (cat) {
					return $timeout(function () {
						obj.resetArticles();
						dashboardService.setTitle(cat);
						angular.forEach(feedsService.feedsDictionary, function (value, key) {
							if (value.category === cat) {
								angular.forEach(value.feeds, function (value, key) {
									promises.push(fetchArticles(value));
								});
							}
						});
						return $q.all(promises).then(function () {
						    obj.articles = temp_articles;
						    dashboardService.hideLoading();
						});
					}, 350);
				},
				getFavourites: function () {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites");
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
						angular.forEach(value.articles, function (value, key) {
						    obj.articles.push(value);
						});
					});
					dashboardService.hideLoading();
				},
				getFavArticlesByCat: function (cat) {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites: " + cat);
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
						if (value.category === cat) {
							angular.forEach(value.articles, function (value, key) {
								obj.articles.push(value);
							});
						}
					});
					dashboardService.hideLoading();
				},
				getFavArticle: function (article) {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites");
					obj.articles.push(article);
					dashboardService.hideLoading();
				},
				addFavourite: function (article) {
					dashboardService.displayLoading();
					return $http.post('/users/' + authService.userID() + '/addFavArticle', article, {
						headers: {
							Authorization: 'Bearer ' + authService.getToken()
						}
					}).then(function (res) {
					    feedsService.getAllFavourites();
						dashboardService.hideLoading();
					});
				},
				removeFavourite: function (article) {
					dashboardService.displayLoading();
					return $http.delete('/users/' + authService.userID() + '/deleteFavFeed/' + article._id + '/' + article.category, {
						headers: {
							Authorization: 'Bearer ' + authService.getToken()
						}
					}).then(function (res) {
						dashboardService.hideLoading();
					});
				},
				resetArticles: function () {
				    this.totalDisplayed = this.displayedIncrement;
					dashboardService.displayLoading();
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
					} catch (err) {
					}
				} else if (format === "ATOM") {
					content = $(item.getElementsByTagName('content')[0].childNodes[0].data).text();
				}
				if (typeof content !== "String") {
					return "";
				}
				else return content;
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
									title: items[i].getElementsByTagName('title')[0].innerHTML
										.replaceAll("apos;", '\'')
										.replaceAll("&apos;", '\'')
										.replaceAll("&amp;", ''),
									link: items[i].getElementsByTagName('link')[0].textContent,
									img: getImage(items[i], feed.format),
									content: getContent(items[i], feed.format),
									feed: feed._id
								};
								if (items[i].getElementsByTagName('pubDate')[0]) {
									articleObj.date = Date.parse(items[i].getElementsByTagName('pubDate')[0].textContent);
								}
								else if (!items[i].getElementsByTagName('pubDate')[0] && !articleObj.img && !articleObj.content) {
									continue;
								}
								articleObj.content = articleObj.content || articleObj.title;
								temp_articles.push(articleObj);
							}
						} else if (feed.format === "ATOM") {
							items = xmlDoc.getElementsByTagName('entry');
							for (var i = 0; i < items.length; i++) {
								var articleObj = {
									title: items[i].getElementsByTagName('title')[0].textContent,
									link: angular.element(items[i].getElementsByTagName('link'))[0].attributes["href"].value,
									img: getImage(items[i], feed.format),
									content: getContent(items[i], feed.format),
									date: Date.parse(items[i].getElementsByTagName('published')[0].textContent),
									feed: feed._id
								};
								articleObj.content = articleObj.content || articleObj.title;
								temp_articles.push(articleObj);
							}
						}
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