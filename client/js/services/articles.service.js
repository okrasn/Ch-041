(function () {
    'use strict';
    angular.module('rssreader').service('articlesService', ['$http', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $q, authService, $timeout, dashboardService, feedsService) {
        var obj = {
            articles: [],
            isFavourites: false
        }
        var articles_num = 50;
        var getImage = function (item, format) {
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
        }
        var getContent = function (item, format) {
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
            return content;
        }
        var fetchArticles = function (feed) {
            return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + articles_num + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSONP&callback=JSON_CALLBACK&output=xml").then(function (response) {
                var parser = new DOMParser(),
                    xmlDoc = parser.parseFromString(response.data.responseData.xmlString, "text/xml"),
                    items = [];
                if (feed.format === "RSS") {
                    items = xmlDoc.getElementsByTagName('item');
                    for (var i = 0; i < items.length; i++) {
                        var articleObj = {};
                        articleObj.title = items[i].getElementsByTagName('title')[0].innerHTML;
                        articleObj.link = items[i].getElementsByTagName('link')[0].textContent;
                        articleObj.img = getImage(items[i], feed.format);
                        articleObj.content = getContent(items[i], feed.format) || articleObj.title;
                        articleObj.date = items[i].getElementsByTagName('pubDate')[0].textContent;
                        obj.articles.push(articleObj);
                    }
                } else if (feed.format === "ATOM") {
                    items = xmlDoc.getElementsByTagName('entry');
                    for (var i = 0; i < items.length; i++) {
                        var articleObj = {};
                        articleObj.title = items[i].getElementsByTagName('title')[0].textContent;
                        articleObj.link = items[i].getElementsByTagName('id')[0].textContent;
                        articleObj.img = getImage(items[i], feed.format);
                        articleObj.content = getContent(items[i], feed.format) || articleObj.title;
                        articleObj.date = items[i].getElementsByTagName('published')[0].textContent;
                        obj.articles.push(articleObj);
                    }
                }
            });
        }
        obj.checkIfFavourites = function () {
            return obj.isFavourites;
        }
        obj.getAllArticles = function () {
            obj.isFavourites = false;
            obj.articles.length = 0;
            dashboardService.setTitle("All");
            dashboardService.resetFeedId();

            angular.forEach(feedsService.feedsDictionary, function (value, key) {
                angular.forEach(value.values, function (value, key) {
                    return fetchArticles(value);
                });
            });
        }
        obj.getArticlesByFeed = function (feed) {
            console.log(obj.articles.length);
            obj.articles.length = 0;
            //console.log(obj.articles.length);
            obj.isFavourites = false;
            dashboardService.setTitle(feed.title);
            dashboardService.setFeedId(feed._id);
            //console.log(obj.articles.length);
            fetchArticles(feed);
            //console.log(obj.articles.length);
        }

        obj.getArticlesByCat = function (cat) {
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
        }

        obj.getFavourites = function () {
            obj.isFavourites = true;
            obj.articles.length = 0;
            dashboardService.setTitle("Favourites");
            dashboardService.resetFeedId();
            angular.copy(feedsService.favourites, obj.articles);
        }
        obj.getFavArticle = function (article) {
            obj.isFavourites = true;
            dashboardService.setTitle("Favourites");
            dashboardService.resetFeedId();
            obj.articles.length = 0;
            obj.articles.push(article);
        }
        obj.addFavourite = function (article) {
            return $http.post('/users/' + authService.userID() + '/addFavArticle', article, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            });
        }
        obj.removeFavourite = function (article) {
            return $http.delete('/users/' + authService.userID() + '/deleteFavFeed/' + article._id, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            });
        }
        return obj;
}]);
})();