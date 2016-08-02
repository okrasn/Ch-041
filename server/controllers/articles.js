var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');
var Article = mongoose.model('Article');

module.exports.all = function (req, res, next) {
    return Article.find().limit(+req.params.count*2).find(function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({
                error: 'Server error'
            });
        }
        console.log(articles);
        if (articles) {
            return res.status(200).json(articles);
        }
    });
}

module.exports.byFeed = function (req, res, next) {
    return Feed.findById(req.params.id, function (err, feed) {
        feed.populate('articles', function (err, articles) {
            if (err) {
                return next(err);
            }
            console.log(articles);
            if (articles) {
                return res.status(200).json(articles);
            }
        });
    });
}

module.exports.byCategory = function (req, res, next) {
    var obj = {};
    obj.articles = [];
    Feed.find({
        category: req.params.cat,
        user: req.user._id
    }, function (err, feed) {
        feed.forEach(function(element, index, array){
            feed[index].populate('articles', function (err, feed) {
                if (err) {
                    return next(err);
                }
                if (feed.articles) {
                    feed.articles.forEach(function(element, index, array){
//                        console.log("Before:");
//                        console.log(obj.articles);
                        obj.articles.push(element);
//                        console.log("After:");
//                        console.log(obj.articles);
                    });
                }
                console.log("!!!!!!!!!!!!!!!!!!!!!:");
                console.log(obj.articles);
                return res.status(200).json(obj.articles);
            });
        });
        
    });
    //return res.status(200).json(obj.articles);
}