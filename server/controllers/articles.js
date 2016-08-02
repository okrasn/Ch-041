var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');
var Article = mongoose.model('Article');

var results = {};
results.articles = [];

module.exports.all = function (req, res, next) {
    User.findById(req.user._id).populate({
        path: 'feeds',
        model: 'Feed',
        populate: {
            path: 'articles',
            model: 'Article'
        }
    }).exec(function (err, result) {
        res.status(200).json(result.feeds);
        //console.log(result.feeds[0].articles);
    });
}

module.exports.byFeed = function (req, res, next) {
    return Feed.findById(req.params.id, function (err, feed) {
        feed.populate('articles', function (err, articles) {
            if (err) {
                return next(err);
            }
            if (articles) {
                return res.status(200).json(articles);
            }
        });
    });
}

module.exports.byCategory = function (req, res, next) {
    User.findById(req.user._id).populate({
        path: 'feeds',
        model: 'Feed',
        populate: {
            path: 'articles',
            model: 'Article'
        }
    }).exec(function (err, result) {
        var temp = result.feeds.filter(function(value){
//            console.log(value.category === req.params.cat);
            return value.category === req.params.cat;
        });
        //console.log(temp.length);
        res.status(200).json(temp);
    });
}