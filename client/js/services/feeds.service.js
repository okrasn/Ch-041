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