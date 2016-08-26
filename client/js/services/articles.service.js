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
                    console.log(article);
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