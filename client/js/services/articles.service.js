(function () {
	'use strict';
	String.prototype.replaceAll = function (target, replacement) {
		return this.split(target).join(replacement);
	};
	angular.module('rssreader').factory('articlesService', ['$http', '$rootScope', '$state', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $rootScope, $state, $q, authService, $timeout, dashboardService, feedsService) {
		var ARTICLES_NUM = 50,
			loadDelay = 350,
			temp_articles = [],
			defer = $q.defer(),
			promises = [],
			obj = {
			    articles: [],
			    advicedArticles: [],
			    articleForRead: null,
			    isFavourites: false,
			    displayedIncrement: 20,
			    totalDisplayed: 20,
			    checkIfFavourites: function () {
			        return obj.isFavourites;
			    },
			    setReadArticle: function (feed, link, type) {
			        var someObj = obj.articleForRead;
			        if(!type){
			            return this.getFeedDataById(feed).then(function (res) {
			                obj.resetArticles();
			                var feedObj = res.data;
			                return fetchArticles(feedObj).then(function (res) {
			                    for (var i = 0; i < res.length; i++) {
			                        if (res[i].link === link) {
			                            obj.articleForRead = res[i];
			                            return;
			                        }
			                    }
			                    obj.articleForRead = null;
			                });
			            });
			        }
			        else if (type === 'adviced' || type === 'favourite') {
				        return getArticleDataByLink(link).then(function (res) {
				            obj.resetArticles();
				            obj.articleForRead = res.data;
				        });
				    }
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
				getArticlesByFeed: function (feed, num) {
					obj.resetArticles();
					return fetchArticles(feed, num).then(function (res) {
						dashboardService.setFeed(feed);
						dashboardService.setTitle(feed.title);
						dashboardService.readSingleFeed.state = true;
						dashboardService.setSortParam('date', 1);
						obj.articles = temp_articles;
						dashboardService.hideLoading();
					}, function (err) {
						dashboardService.hideLoading();
						console.log(err);
						$state.go("404");
					});
				},
				getArticlesByCat: function (cat) {
					var found = false;
					obj.resetArticles();
					angular.forEach(feedsService.feedsDictionary, function (value, key) {
						if (value.category === cat) {
							found = true;
							angular.forEach(value.feeds, function (value, key) {
								promises.push(fetchArticles(value));
							});
						}
					});
					if (!found) {
						return $q.reject().catch(function (err) {
							dashboardService.hideLoading();
							$state.go("404");
						});
					}
					return $q.all(promises).then(function () {
						dashboardService.setTitle(cat);
						obj.articles = temp_articles;
						dashboardService.hideLoading();
					});
				},
				getAdvicedArticlesByCat: function (cat) {
					obj.resetArticles();
					angular.forEach(feedsService.advicedDictionary, function (value, key) {
						if (value.category === cat) {
							angular.forEach(value.feeds, function (value, key) {
								promises.push(fetchArticles(value, 1));
							});
						}
					});
					return $q.all(promises).then(function () {
						obj.articles = temp_articles;
						dashboardService.hideLoading();
					});
				},
				getFavourites: function () {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites");
					var tempCategory = '';
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
					    tempCategory = value.category;
					    angular.forEach(value.articles, function (value, key) {
					        value.category = tempCategory;
							obj.articles.push(value);
						});
					});
					dashboardService.hideLoading();
				},
				getFavArticlesByCat: function (cat) {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites: " + cat);
					var tempCategory = '';
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
					    if (value.category === cat){
					        tempCategory = cat;
						    angular.forEach(value.articles, function (value, key) {
						        value.category = tempCategory;
								obj.articles.push(value);
							});
						}
					});
					dashboardService.hideLoading();
				},
				getFavArticle: function (article) {
					obj.resetArticles();
					dashboardService.hideSortList.state = true;
					obj.isFavourites = true;
					dashboardService.setTitle("Favourites");
					obj.articles.push(article);
					dashboardService.hideLoading();
				},
				addFavourite: function (article) {
					dashboardService.displayLoading();
					return $http.post('/users/' + authService.userID() + '/addFavArticle', article).then(function (res) {
					    angular.copy(res.data, feedsService.favouritesDictionary);
					    dashboardService.hideLoading();
					    return res;
					});
				},
				removeFavourite: function (article) {
					dashboardService.displayLoading();
					return $http.delete('/users/' + authService.userID() + '/deleteFavFeed/' + article._id).then(function (res) {
					    angular.copy(res.data, feedsService.favouritesDictionary);
					    dashboardService.hideLoading();
					    return res;
					});
				},
				getAdvicedArticles: function () {
				    dashboardService.displayLoading();
					obj.advicedArticles.length = 0;
					return $http.get('/users/' + authService.userID() + "/advicedArticles").then(function (res) {
					    angular.copy(res.data, obj.advicedArticles);
					    dashboardService.hideLoading();
					}, function (err) {
						console.log(err);
					});
				},
				getAdvicedFeedsArticles: function () {
					obj.advicedArticles.length = 0;
					return $http.get('/users/' + authService.userID() + "/advicedArticles").then(function (res) {
						angular.copy(res.data, obj.advicedArticles);
					}, function (err) {
						console.log(err);
					});
				},
				resetArticles: function () {
					dashboardService.hideSortList.state = false;
					dashboardService.readSingleFeed.state = false;
					this.totalDisplayed = this.displayedIncrement;
					dashboardService.displayLoading();
					temp_articles.length = 0;
					obj.articles.length = 0;
					obj.isFavourites = false;
					dashboardService.resetFeed();
					promises.length = 0;
				},
				getFeedDataById: function (id) {
					return $http.post('/users/' + authService.userID() + '/getFeedData', { id: id });
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
				if (typeof content !== 'string') {
					return "";
				}
				else return content.toString();
			},
			fetchArticles = function (feed, num, from) {
				var articlesNum = ARTICLES_NUM;
				if (num) {
					articlesNum = num;
				}
				if (!from || from > num - 1) {
					from = 0;
				}
				return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + articlesNum + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSONP&callback=JSON_CALLBACK&output=xml")
					.then(function (response) {
						var parser = new DOMParser(),
							xmlDoc = parser.parseFromString(response.data.responseData.xmlString, "text/xml"),
							items = [];
						if (feed.format === "RSS") {
							items = xmlDoc.getElementsByTagName('item');
							if (from > items.length) {
								from = 0;
							}
							for (var i = from; i < items.length; i++) {
								var articleObj = {
									title: items[i].getElementsByTagName('title')[0].innerHTML,
									link: items[i].getElementsByTagName('link')[0].textContent,
									img: getImage(items[i], feed.format),
									content: getContent(items[i], feed.format),
									feed: feed._id
								};
								if (articleObj.title) {
									articleObj.title.replaceAll("apos;", '\'')
													.replaceAll("&apos;", '\'')
													.replaceAll("&amp;", '')
													.replaceAll("&#8217;", 'bb');
								}
								if (items[i].getElementsByTagName('pubDate')[0]) {
									articleObj.date = Date.parse(items[i].getElementsByTagName('pubDate')[0].textContent);
								}
								else if (!items[i].getElementsByTagName('pubDate')[0] && !articleObj.img && !articleObj.content) {
									continue;
								}
								articleObj.content = articleObj.content ? articleObj.content : articleObj.title;
								temp_articles.push(articleObj);
							}
						} else if (feed.format === "ATOM") {
							items = xmlDoc.getElementsByTagName('entry');
							if (from > items.length) {
								from = 0;
							}
							for (var i = from; i < items.length; i++) {
								var articleObj = {
									title: items[i].getElementsByTagName('title')[0].textContent,
									link: angular.element(items[i].getElementsByTagName('link'))[0].attributes["href"].value,
									img: getImage(items[i], feed.format),
									content: getContent(items[i], feed.format),
									date: Date.parse(items[i].getElementsByTagName('published')[0].textContent),
									feed: feed._id
								};
								articleObj.content = articleObj.content ? articleObj.content : articleObj.title;
								temp_articles.push(articleObj);
							}
						}
						dashboardService.loadingIcon = false;
						return temp_articles;
					});
			},
			getArticleDataByLink = function (link) {
				return $http.post('/users/' + authService.userID() + '/getFavArticle', { link: link });
			}
		return obj;
	}]);
})();