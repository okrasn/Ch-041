angular.module('rssreader').service('articlesService', ['$http', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $q, authService, $timeout, dashboardService, feedsService) {
    var obj = {
        articles: [],
        isFavourites: false
    }
    var articles_num = 50;

    var fetchArticles = function (feed) {
        return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + articles_num + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSONP&callback=JSON_CALLBACK&output=xml").then(function (response) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(response.data.responseData.xmlString, "text/xml");
                var items = [];
                if (feed.format === "RSS") {
                    items = xmlDoc.getElementsByTagName('item');
                    for (var i = 0; i < items.length; i++) {
                        var articleObj = {};
                        articleObj.title = items[i].getElementsByTagName('title')[0].innerHTML;
                        articleObj.link = items[i].getElementsByTagName('link')[0].textContent;
                        // -- Image ---
                        if (!items[i].getElementsByTagName('enclosure').length) {
                            var foundImg = {
                                src: ""
                            }
                            try {
                                foundImg.src = $(items[i].getElementsByTagName("description")[0].textContent).find('img')[0].src;
                            } catch (err) {
                                foundImg.src = ""
                            }
                            articleObj.img = foundImg.src;
                        } else {
                            articleObj.img = items[i].getElementsByTagName('enclosure')[0].getAttribute('url');
                        }
                        // ---------
                        var content = document.createElement('div');
                        content.innerHTML = items[i].getElementsByTagName('description')[0].textContent;
                        articleObj.content = $(content).text();
                        articleObj.date = items[i].getElementsByTagName('pubDate')[0].textContent;
                        obj.articles.push(articleObj);
                    }
                } else if (feed.format === "ATOM") {
                    items = xmlDoc.getElementsByTagName('entry');
                    for (var i = 0; i < items.length; i++) {
                        var articleObj = {};
                        var img = $.parseHTML(items[i].getElementsByTagName('content')[0].childNodes[0].data)[0].src;
                        if (img === undefined) {
                            img = "";
                        }
                        articleObj.img = img;
                        articleObj.title = items[i].getElementsByTagName('title')[0].textContent;
                        articleObj.link = items[i].getElementsByTagName('id')[0].textContent;
                        articleObj.content =
                            $(items[i].getElementsByTagName('content')[0].childNodes[0].data).text();
                        articleObj.date = items[i].getElementsByTagName('published')[0].textContent;
                        obj.articles.push(articleObj);
                    }
                }

            },
            function (err) {
                console.log(err);
            });
    }
    obj.checkIfFavourites = function () {
        return obj.isFavourites;
    }
    obj.getAllArticles = function () {
        console.log("all");
        //        return $timeout(function(){
        //            console.log("Resolving");
        //        }, 2000);
        obj.isFavourites = false;
        obj.articles.length = 0;
        dashboardService.setTitle("All");
        dashboardService.resetFeedId();

        angular.forEach(feedsService.feedsDictionary, function (value, key) {
            angular.forEach(value.values, function (value, key) {
                return fetchArticles(value).then(function (res) {
                    console.log("res");
                });
            });
        });
    }

    obj.getArticlesByFeed = function (feed) {
        obj.isFavourites = false;
        obj.articles.length = 0;
        dashboardService.setTitle(feed.title);
        dashboardService.setFeedId(feed._id);
        fetchArticles(feed);
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

        console.log(feedsService.favourites);
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
        //        console.log("Removing:");
        //        console.log("ArticleId:" + article._id);
        return $http.delete('/users/' + authService.userID() + '/deleteFavFeed/' + article._id, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        });
    }
    return obj;
            }]);