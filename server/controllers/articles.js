var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Feed = mongoose.model('Feed'),
    Article = mongoose.model('Article');

module.exports.addFavArticle = function (req, res, next) {
    req.user.populate({
        path: 'favourites',
        model: 'Article'
    }, function (err, user) {
        if (user.favourites.find(function (elem) {
                return elem.link === req.body.link;
            })) {
            res.statusCode = 400;
            return res.send({
                message: ERRORS.fav_article_already_added
            });
        } else {
            var article = new Article(req.body);
            article.save(function (err, article) {
                if (err) {
                    return next(err);
                }
                req.user.favourites.push(article);
                req.user.save(function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(article);
                });
            });
        }
    });
};

module.exports.removeFavArticle = function (req, res, next) {
    // First, delete feed record from user feeds array 
    req.user.favourites.forEach(function (elem, index, array) {
        if (elem == req.params.id) {
            req.user.favourites.splice(index, 1);
            req.user.save(function (err) {
                if (err) return handleError(err);
            });
        }
    });

    // Delete feed from database
    return Article.findById(req.params.id, function (err, article) {
        if (!article) {
            res.statusCode = 404;
            return res.send({
                error: ERRORS.article_not_found
            });
        }
        return article.remove(function (err) {
            if (!err) {
                return res.send({
                    status: 'OK'
                });
            } else {
                res.statusCode = 500;
                log.error(ERRORS.internal_error, res.statusCode, err.message);
                return res.send({
                    error: ERRORS.article_not_found
                });
            }
        });
    });
}

module.exports.allFavourites = function (req, res, next) {
    req.user.populate({
        path: 'favourites',
        model: 'Article'
    }, function (err, user) {
        var favourites = [];
        for (var i = 0; i < user.favourites.length; i++) {
            favourites.push(user.favourites[i]);
        }
        res.json(favourites);
    });
}