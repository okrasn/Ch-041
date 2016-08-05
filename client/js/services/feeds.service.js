angular.module('rssreader').service('feedsService', ['$http', '$state', 'authService', 'dashboardService', function ($http, $state, authService, dashboardService) {
    var articlesNum = 10;
    var obj = {
        // data structure containing [{key: category, values: [feeds]}]
        feedsDictionary: [],
        allArticles: [],
        CATEGORIES: ["News", "IT", "Sport", "Design", "Movies", "Music", "Culture", "Nature", "Economics", "Science"]
    }
    obj.getAllFeeds = function () {
        return $http.get('/users/' + authService.userID(), {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            angular.copy(res.data, obj.feedsDictionary);
        });
    }

    obj.addFeed = function (feed) {       
        return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + articlesNum + "&q=" + encodeURIComponent(feed.link) + "&method=JSON&callback=JSON_CALLBACK").then(function (responce) {
            if (feed.category === undefined) {
                throw new Error("Choose category");
            }
            if (responce.data.responseData === null) {
                throw new Error("URL is incorrect or does not contain RSS Feed data");
            }

            //We are receiveng 'recievedFeed' and converting it to convenient 'feedObj'
            var recievedFeed;
            var feedObj = {};

            recievedFeed = responce.data.responseData.feed;

            feedObj.title = recievedFeed.description || recievedFeed.title;
            feedObj.link = recievedFeed.link;
            feedObj.category = feed.category;
            feedObj.articles = [];
            feedObj.user = authService.userID();

            //Debug
            //            console.log("recievedFeed:");
            //            console.log(recievedFeed);
            //            console.log("feedObj:");
            //            console.log(feedObj);
            //            console.log("mediaGroups:");
            //            console.log(recievedFeed.entries[1].mediaGroups);

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
                feedObj.articles.push(articleObj);
            }
            return $http.post('/users/' + authService.userID() + '/addFeed', feedObj, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            })
        }, function (err) {
            console.log(err);
        });
    }
    obj.removeFeed = function (feedId) {
        //console.log(feedId);
        return $http.delete('/users/' + authService.userID() + '/deleteFeed/' + feedId, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).success(function (res) {    
            $state.reload("dashboard");
            $state.go("dashboard." + dashboardService.currentView);
            //console.log("deleted");
        });
    }
    return obj;
}]);