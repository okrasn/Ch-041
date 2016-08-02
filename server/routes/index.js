var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    jwt = require('express-jwt'),
    Article = mongoose.model('Article'),
    Feed = mongoose.model('Feed'),
    User = mongoose.model('User');

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var authCtrl = require('../controllers/authentication');

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('can\'t find user'));
        }
        req.user = user;
        return next();
    });
});

// get user and his feeds
router.get('/users/:user', auth, function (req, res, next) {
    req.user.populate('feeds', function (err, feed) {
        if (err) {
            return next(err);
        }
        //Select all user categories
        var unique = {};
        var distinct = [];
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
});

router.get('/users/:user/articles/all/:count', auth, function (req, res, next) {
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
});

router.get('/users/:user/articles/feed/:id/:count', auth, function (req, res, next) {
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
});

router.get('/users/:user/articles/category/:cat/:count', auth, function (req, res, next) {
    var articles = [];
    console.log(req.params.cat);
    Feed.find({
        category: req.params.cat
    }, function (err, feed) {        
        feed.forEach(function(element, index, array){
            feed[index].populate('articles', function (err, feed) {
//                console.log(feed);
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
        console.log(articles);
        return res.status(200).json(articles);
    });
});


// add new feed
router.post('/users/:user/addFeed', auth, function (req, res, next) {
    Feed.findOne({
        link: req.body.link,
        user: req.body.user
    }, function (err, foundFeed) {
        if (foundFeed) {
            console.log('You have already added this feed to ' + foundFeed.category + "category");

            return res.status(400).json({
                message: "You have already added this feed to " + foundFeed.category + " category"
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
});

router.delete('/users/:user/deleteFeed/:id', function (req, res, next) {
    return Feed.findById(req.params.id, function (err, feed) {
        if (!feed) {
            res.statusCode = 404;
            return res.send({
                error: 'Feed not found'
            });
        }
        return feed.remove(function (err) {
            if (!err) {
                return res.send({
                    status: 'OK'
                });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({
                    error: 'Server error'
                });
            }
        });
    });
});

module.exports = router;