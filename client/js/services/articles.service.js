angular.module('rssreader').service('articlesService', ['$http', 'authService', function ($http, authService) {
    var obj = {
        articles: []
    }
    var ARTICLES_COUNT = 10;
    obj.getAllArticles = function () {
        var type = "all";
        return $http.get('/users/' + authService.userID() + '/articles/' + type + '/' + ARTICLES_COUNT, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            console.log("articles recieved:");
            angular.copy(res.data, obj.articles);
            console.log(obj.articles);
        });
    }
    obj.getArticlesByFeed = function (id) {
        var type = "feed";
        return $http.get('/users/' + authService.userID() + '/articles/' + type + '/' + id + '/' + ARTICLES_COUNT, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            console.log("articles recieved for feed" + id + ":");
            angular.copy(res.data.articles, obj.articles);
            console.log(res.data.articles);
        });
    }

    obj.getArticlesByCat = function (cat) {
        var type = "category";
        return $http.get('/users/' + authService.userID() + '/articles/' + type + '/' + cat + '/' + ARTICLES_COUNT, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            console.log("articles recieved for category " + cat + ":");
            angular.copy(res.data, obj.articles);
            console.log(obj.articles);
        });
    }
    return obj;
}]);