var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed'),
	Article = mongoose.model('Article'),
	ERRORS = {
		fav_article_already_added: 'You have already added this article to favourites',
		article_not_found: 'Article not found'
	}

module.exports.addFavArticle = function (req, res, next) {
	req.user.populate('favourites', function (err, user) {
		if (user.favourites.find(function (elem) {
				return elem.link === req.body.link;
		})) {
			res.statusCode = 400;
			return res.send({
				message: ERRORS.fav_article_already_added
			});
		} else {
			var article = new Article(req.body);
			if (!article.category) {
				article.category = 'Unsorted';
			}
			if (user.favCategories.indexOf(article.category) === -1) {
				user.favCategories.push(article.category);
			}
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
	req.user.populate('favourites', function (err, user) {
		// First, delete article record from user favArticles array 
		for (var i = 0; i < user.favourites.length; i++) {
			if (user.favourites[i] === req.params.id) {
				user.favourites.splice(i, 1);
				user.save(function (err) {
					if (err) return next(err);
				});
			}
		}

		// Delete article from database
		Article.findById(req.params.id, function (err, article) {
			var catExist = false;
			try{
				for (var i = 0; i < user.favourites.length; i++) {
					if (user.favourites[i].category === article.category && user.favourites[i].link !== article.link) {
						catExist = true;
					}
				}
			}
			catch (e) {
				return next(e);
			}
			if (!catExist) {
				for (var i = 0; i < user.favCategories.length; i++) {
					if (article.category === user.favCategories[i]) {
						user.favCategories.splice(i, 1);
						user.save(function (err) {
							if (err) return next(err);
						});
					}
				}
			}
			if (!article) {
				res.statusCode = 404;
				return res.send({
					error: ERRORS.article_not_found
				});
			}
			return article.remove(function (err) {
				if (user.favCategories.indexOf(req.body.category) === -1) {
					user.favCategories.push(req.body.category);
				}
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
	});
}

module.exports.allFavourites = function (req, res, next) {
	// Flow is the same to feeds selection
	req.user.populate('favourites', function (err, user) {
		if (err) {
			console.log("ERROR: " + err);
			return next(err);
		}

		// Data will be storred in dictionary with categories as keys and favourites articles as values
		var favouritesDictionary = [];
		var containsKey = function (key) {
			for (var i = 0; i < favouritesDictionary.length; i++) {
				if (favouritesDictionary[i].key === key) {
					return i;
				}
			}
			return -1;
		}
		// Push categories as keys
		for (var i = 0; i < user.favCategories.length; i++) {
			favouritesDictionary.push({
				key: user.favCategories[i],
				values: []
			});
		}
		// Push favourite articles as values
		for (var i = 0; i < user.favourites.length; i++) {
			var j = containsKey(user.favourites[i].category);
			if (j >= 0) {
				favouritesDictionary[j].values.push(user.favourites[i]);
			}
		}
		res.json(favouritesDictionary);
	});
}