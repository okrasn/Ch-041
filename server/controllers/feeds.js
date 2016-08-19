var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Feed = mongoose.model('Feed'),
    Article = mongoose.model('Article'),
    ERRORS = {
        choose_cat: 'Choose category',
        cant_find_user: 'Can\'t find user',
        feed_already_added: 'You have already added this feed ',
        feed_not_found: 'Feed not found',
        article_not_found: 'Article not found',
        server_error: 'Server error',
        internal_error: 'Internal error(%d): %s'
    };

module.exports.userParam = function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }
        if (!user) {
            return next(new Error(ERRORS.cant_find_user));
        }
        req.user = user;
        return next();
    });
};

module.exports.allFeed = function (req, res, next) {
    req.user.populate('feeds', function (err, user) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }

        // Data will be storred in dictionary with categories as keys and feeds as values
        var feedsDictionary = [];
        var containsKey = function (key) {
            for (var i = 0; i < feedsDictionary.length; i++) {
                if (feedsDictionary[i].key === key) {
                    return i;
                }
            }
            return -1;
        }
        // Push categories as keys
        for (var i = 0; i < user.categories.length; i++) {
            feedsDictionary.push({
                key: user.categories[i],
                values: []
            });
        }
        // Push feeds as values
        for (var i = 0; i < user.feeds.length; i++) {
            var j = containsKey(user.feeds[i].category);
            if (j >= 0) {
                feedsDictionary[j].values.push(user.feeds[i]);
            }
        }
        res.json(feedsDictionary);
    });
}

module.exports.add = function (req, res, next) {
    if (req.body.category === undefined) {
        return res.status(400).json({
            message: ERRORS.choose_cat
        });
    }
    req.user.populate("feeds", function (err, user) {
        if (!user.feeds.find(function (elem) {
                return elem.rsslink == req.body.rsslink;
        })) {
            var feed = new Feed(req.body);
            if (user.categories.indexOf(req.body.category) === -1) {
                user.categories.push(req.body.category);
            }
            feed.save(function (err, feed) {
                if (err) {
                    return next(err);
                }
                user.feeds.push(feed);
                user.save(function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(feed);
                });
            });
        } else {
            return res.status(400).json({
                message: ERRORS.feed_already_added
            });
        }
    });
};

module.exports.remove = function (req, res, next) {
    req.user.populate('feeds', function (err, user) {
        // First, delete feed record from user feeds array 
        for (var i = 0; i < user.feeds.length; i++) {
            if (user.feeds[i] === req.params.id) {
                user.feeds.splice(i, 1);
                user.save(function (err) {
                    if (err) return next(err);
                });
            }
        }

        // Delete feed from database
        Feed.findById(req.params.id, function (err, feed) {
            var catExist = false;
            for (var i = 0; i < user.feeds.length; i++) {
                if (user.feeds[i].category === feed.category && user.feeds[i].rsslink !== feed.rsslink) {
                    catExist = true;
                }
            }
            if (!catExist) {
                for (var i = 0; i < user.categories.length; i++) {
                    if (feed.category === user.categories[i]) {
                        user.categories.splice(i, 1);
                        user.save(function (err) {
                            if (err) return next(err);
                        });
                    }
                }
            }
            if (!feed) {
                res.statusCode = 404;
                return res.send({
                    error: ERRORS.feed_not_found
                });
            }
            return feed.remove(function (err) {
                if (user.categories.indexOf(req.body.category) === -1) {
                    user.categories.push(req.body.category);
                }
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
    });
}

module.exports.setCategoryOrder = function (req, res, next) {
    req.user.categories = req.body.newCategories;
    req.user.save(function (err) {
        if (err) return next(err);
    });
}

module.exports.setFavsCategoryOrder = function (req, res, next) {
    req.user.favCategories = req.body.newCategories;
    req.user.save(function (err) {
        if (err) return next(err);
    });
}