var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Feed = mongoose.model('Feed'),
    Article = mongoose.model('Article');

var ERRORS = {
    choose_cat: 'Choose category',
    cant_find_user: 'Can\'t find user',
    feed_already_added: 'You have already added this feed to ',
    feed_not_found: 'Feed not found',
    server_error: 'Server error',
    internal_error: 'Internal error(%d): %s'
}

module.exports.userParam = function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error(ERRORS.cant_find_user));
        }
        req.user = user;
        return next();
    });
}

module.exports.allFeed = function (req, res, next) {
    req.user.populate('feeds', function (err, feed) {
        var unique = {},
            distinct = [];

        if (err) {
            return next(err);
        }
        //Select all uniq user categories

        for (var i in feed.feeds) {
            if (typeof (unique[feed.feeds[i].category]) === "undefined") {
                distinct.push(feed.feeds[i].category);
            }
            unique[feed.feeds[i].category] = 0;
        }

        //Writing data to dictionary with category as keys and feeds as values
        var feedsDictionary = [];

        var containsKey = function (key) {
            var found = false;
            for (var i = 0; i < feedsDictionary.length; i++) {
                if (feedsDictionary[i].key === key) {
                    found = true;
                    return i;
                }
            }
            if (!found) return -1;
        }

        for (var i = 0; i < distinct.length - 1; i++) {
            feedsDictionary.push({
                key: distinct[i],
                values: []
            });
        }

        for (var i = 0; i < feed.feeds.length; i++) {
            var j = containsKey(feed.feeds[i].category);
            if (j >= 0) {
                feedsDictionary[j].values.push(feed.feeds[i]);
            }
        }
        res.json(feedsDictionary);
    });
}

module.exports.add = function (req, res, next) {
    Feed.findOne({
        link: req.body.link,
        user: req.body.user
    }, function (err, foundFeed) {
        if (foundFeed) {
            return res.status(400).json({
                message: ERRORS.feed_already_added + foundFeed.category
            });
        }
        if (req.body.category === undefined) {
            return res.status(400).json({
                message: ERRORS.choose_cat
            });
        }
        var feed = new Feed(req.body);
        feed.articles = [];
        for (var i = 0; i < req.body.articles.length; i++) {
            article = new Article(req.body.articles[i]);
            article.feed = feed._id;
            feed.articles.push(article);
            article.save(function (err, article) {
                console.log(feed);
                if (err) {
                    return next(err);
                }
            });
        }
        feed.save(function (err, feed) {
            if (err) {
                return next(err);
            }
            req.user.feeds.push(feed);
            req.user.save(function (err, user) {
                if (err) {
                    return next(err);
                }
                res.json(feed);
            });
        });
    });
}
module.exports.remove = function (req, res, next) {
    return Feed.findById(req.params.id, function (err, feed) {
        if (!feed) {
            res.statusCode = 404;
            return res.send({
                error: ERRORS.feed_not_found
            });
        }
        return feed.remove(function (err) {
            if (!err) {
                return res.send({
                    status: 'OK'
                });
            } else {
                res.statusCode = 500;
                log.error(ERRORS.internal_error, res.statusCode, err.message);
                return res.send({
                    error: ERRORS.feed_not_found
                });
            }
        });
    });
}