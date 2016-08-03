angular.module('rssreader').factory('dashboardService', function () {
    var obj = {
        title: ""
    };
    obj.setTitle = function(title){
        console.log(title);
        this.title = title;
    }
    return obj;
});