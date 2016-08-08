angular.module('rssreader').service('articlesService', ['$http', 'authService', 'dashboardService', 'feedsService', function ($http, authService, dashboardService, feedsService) {
    var obj = {
        articles: []
    }
    var articles_num = 50;

    var fetchArticles = function (feed) {
        return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" +  articles_num + "&q=" + encodeURIComponent(feed.rsslink) + "&method=JSON&callback=JSON_CALLBACK").then(function (response) {
            var recievedFeed = response.data.responseData.feed;
            for (var i = 0; i < recievedFeed.entries.length; i++) {
                var articleObj = {};
                var content = document.createElement("content");
                content.innerHTML = recievedFeed.entries[i].content;
                var img;
                if ($(content).find('img')[0] === undefined) {
                    img = "";
                } else {
                    img = $(content).find('img')[0].src;
                }
                articleObj.title = recievedFeed.entries[i].title;
                articleObj.link = recievedFeed.entries[i].link;
                articleObj.content = recievedFeed.entries[i].contentSnippet;
                articleObj.img = img;
                articleObj.date = recievedFeed.entries[i].publishedDate;
                obj.articles.push(articleObj);
                console.log("Push");
            }
//            console.log("articles:");
//            console.log(obj.articles);
        });
    }

    obj.getAllArticles = function () {
        obj.articles.length = 0;
        dashboardService.setTitle("All");
        dashboardService.resetFeedId();
        
        angular.forEach(feedsService.getDictionary(), function (value, key) {
            angular.forEach(value.values, function (value, key) {
                fetchArticles(value);
            });
        });
    }

    obj.getArticlesByFeed = function (feed) {
        obj.articles.length = 0;
        dashboardService.setTitle(feed.title);
        dashboardService.setFeedId(feed._id);
        fetchArticles(feed);
    }

    obj.getArticlesByCat = function (cat) {
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
    return obj;
}]);