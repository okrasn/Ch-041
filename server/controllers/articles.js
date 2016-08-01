var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');
var Article = mongoose.model('Article');

module.exports.all = function (req, res, next) {
    return Article.find(function (err, articles) {
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
    var articles = [];
    Feed.find({
        category: req.params.cat
    }, function (err, feed) {        
        feed.forEach(function(element, index, array){
            feed[index].populate('articles', function (err, feed) {
                if (err) {
                    return next(err);
                }
                if (feed.articles) {
                    feed.articles.forEach(function(element, index, array){
                        articles.push(element);
                    });
                }
            });
        });
        return res.status(200).json(articles);
    });
}