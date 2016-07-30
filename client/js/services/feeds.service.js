angular.module('rssreader').service('feedsService', ['$http', 'authService', function ($http, authService) {
    var obj = {
        feeds: []
    }
    obj.get = function (id) {
        return $http.get('/users/' + id, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            angular.copy(res.data.feeds, obj.feeds);
        });
    }

    obj.addFeed = function (feed) {
     $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + feed.link +
            "&callback=JSON_CALLBACK").then(function (responce) {
            //var recievedFeed = responce.data.responseData.feed;
            if(responce.data.responseData == null){
                throw new Error('URL is incorrect'); 
            }
            //obj.feeds.push(responce.data.responseData.feed);
//            console.log("Recieved Feed: ");
//            console.log(recievedFeed);
            var feedObj = {
                title: recievedFeed.description,
                link: recievedFeed.link,
                category: "",
                articles: [],
                user: authService.userID()
            }
            for (var i = 0; i < recievedFeed.entries.length; i++) {
                var articleObj = {}
                articleObj.title = recievedFeed.entries[i].title;
                articleObj.link = recievedFeed.entries[i].link;
                articleObj.content = recievedFeed.entries[i].contentSnippet;
                articleObj.date = recievedFeed.entries[i].publishedDate;
                feedObj.articles.push(articleObj);
                //console.log(articleObj);
            }
//            console.log("Modified Feed: ");
//            console.log(feedObj);
            $http.post('/users/' + authService.userID() + '/addFeed', feedObj, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            }).success(function (res) {});
            return feeds;
        }, function (error) {
            console.log(error);
        });
    }

    // obj.addFeed = function (id, feed) {
    //     return $http.post('/users/' + id + '/addFeed', feed, {
    //         headers: {
    //             Authorization: 'Bearer ' + authService.getToken()
    //         }
    //     }).success(function (res) {
    //     });
    // }
    obj.removeFeed = function (id, feedId) {
        console.log(feedId);
        return $http.delete('/users/' + id + '/deleteFeed/' + feedId, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).success(function (res) {
            console.log("deleted");
        });
    }
    return obj;
}]);