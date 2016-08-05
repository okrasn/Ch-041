angular.module('rssreader').service('dashboardService', function () {
    var defaultView = 'th-large';
    that = this;
    this.title = "";
    this.setTitle = function(title){ 
        if(title == "Add Feed"){
            this.resetFeedId();
        }
        that.title = title;
//        console.log("Title: " + that.title);
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