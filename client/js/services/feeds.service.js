angular.module('rssreader').service('feedsService', ['$http', 'authService', function ($http, authService) {
    var feeds = [];
    return {
        get: function (id) {
            return $http.get('/users/' + id, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            }).then(function (res) {
                angular.copy(res.data.feeds, feeds);
            });
        },
        getFeeds: function () {
            return feeds;
        },
        addFeed: function (id, feed) {
            return $http.post('/users/' + id + '/addFeed', feed, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            }).success(function(res){
                feeds.push(res);
            });
        },
        removeFeed: function (id, feedId) {
            console.log(feedId);
            return $http.delete('/users/' + id + '/deleteFeed/' + feedId, {
                headers: {
                    Authorization: 'Bearer ' + authService.getToken()
                }
            }).success(function(res){
                console.log("deleted");
            });
        }
    }
}]);