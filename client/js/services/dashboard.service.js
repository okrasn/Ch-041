angular.module('rssreader').service('dashboardService', function () {
    var defaultView = 'th-large';
    that = this;
    this.title = "All";
    this.setTitle = function(title){ 
        that.title = title;
        console.log("Title: " + that.title);
    }
    this.getTitle = function(){
        return that.title;
    }
    this.currentView = defaultView;
    
    this.currentFeed = '';
    this.getFeedId = function(){
        return that.currentFeed;
    }
    this.setFeedId = function(id){
        that.currentFeed = id;
    }
    this.resetFeedId = function(){
        that.currentFeed = '';
    }
});