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
    req.user.populate('feeds', function (err, user) {
        if (err) {
            return next(err);
        }
        console.log("Sending user");
        res.json(user);
    });
});

// add new feed
router.post('/users/:user/addFeed', auth, function (req, res, next) {
    var feed = new Feed(req.body);
    feed.articles = [];
    console.log(feed);

    for (var i = 0; i < req.body.articles.length; i++) {
        article = new Article(req.body.articles[i]);
        article.feed = feed._id;
        feed.articles.push(article);
        article.save(function (err, article) {
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