angular.module('add_service',[])
    .factory('add_feed_service',['$http',function($http){
        var transferArray = [];
        var urlTemp = '';
        var feeds = [];
        function setUrl(url){
            urlTemp = url;
        }
        function getUrl(){
            return urlTemp;
        }

        function setArray(obj){
            transferArray = obj;
        }
        function getArray(){
            return transferArray;
        }
        function getFeeds(){
            return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + getUrl() +
                "&callback=JSON_CALLBACK").then(function(responce){
                feeds.push(responce.data.responseData.feed.entries[0]);
                console.log(feeds);
            },function(responce){
                console.log('Error');
            });
        }


       // console.log(urlTemp);
        return{
            setArray : setArray,
            getArray : getArray,
            setUrl : setUrl,
            getUrl : getUrl,
            getFeeds : getFeeds
        }
    }]);
