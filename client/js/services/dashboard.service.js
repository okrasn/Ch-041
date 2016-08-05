angular.module('rssreader').service('dashboardService', function () {
    that = this;
    this.title = "All";
    this.setTitle = function(title){ 
        that.title = title;
        console.log("Title: " + that.title);
    }
    this.getTitle = function(){
        return that.title;
    }
    this.currentView = 'Th-large';
});