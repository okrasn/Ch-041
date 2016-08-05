angular.module('rssreader').service('articlesService', ['$http', 'authService', 'dashboardService', function ($http, authService, dashboardService) {
    var obj = {
        articles: []
    }
    var ARTICLES_COUNT = 10;
    
    obj.getAllArticles = function () {
        dashboardService.setTitle("All");
        obj.articles.length = 0;
        var type = "all";
        return $http.get('/users/' + authService.userID() + '/articles/' + type + '/' + ARTICLES_COUNT, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            console.log("All articles recieved:");
            angular.forEach(res.data, function (value, key) {
                angular.forEach(value.articles, function (value, key) {
                    obj.articles.push(value);
                });
            });
            console.log(obj.articles);
        });
    }
    obj.getArticlesByFeed = function (id) {
        obj.articles.length = 0;
        var type = "feed";
        return $http.get('/users/' + authService.userID() + '/articles/' + type + '/' + id + '/' + ARTICLES_COUNT, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            //console.log("articles recieved for feed" + id + ":");
            angular.copy(res.data.articles, obj.articles);
        });
    }

    obj.getArticlesByCat = function (cat) {
        dashboardService.setTitle(cat);
        obj.articles.length = 0;
        var type = "category";
        return $http.get('/users/' + authService.userID() + '/articles/' + type + '/' + cat + '/' + ARTICLES_COUNT, {
            headers: {
                Authorization: 'Bearer ' + authService.getToken()
            }
        }).then(function (res) {
            console.log("All articles for category " + cat + " recieved: ");
            angular.forEach(res.data, function (value, key) {
                angular.forEach(value.articles, function (value, key) {
                    obj.articles.push(value);
                });
            });
            //console.log(obj.articles);
        });
    }
    return obj;
}]);