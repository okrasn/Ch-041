var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed'),
	Article = mongoose.model('Article'),
	ERRORS = {
		choose_cat: 'Choose category',
		fav_article_already_added: 'You have already added this article to favourites',
		article_not_found: 'Article not found',
		enter_article_url: 'Enter article link',
		cant_delete_article_no_such_cat: "Cant delete such article, no such category found within your account",
		cant_delete_article_no_such_article: "Cant delete such article, no such article found within your account"
	}

module.exports.addFavArticle = function (req, res, next) {
	if (req.body.link === undefined) {
		return res.status(400).json({
			message: ERRORS.enter_article_url
		});
	}
	if (req.body.category === undefined) {
	    req.body.category = 'Unsorted';
	}

	Article.findOne({ link: req.body.link }, function (err, article) {
		if (err) {
			return next(err);
		}

		var foundCategory = req.user.favouritesDictionary.filter(function (elem) {
			return elem.category === req.body.category;
		});

		if (article) {
			if (!foundCategory.length) {
				if (err) {
					return next(err);
				}
				var newArticleElement = {
					category: req.body.category,
					articles: []
				}
				newArticleElement.articles.push(article);
				req.user.favouritesDictionary.push(newArticleElement);
				req.user.save(function (err, user) {
					if (err) {
						return next(err);
					}
					res.json(article);
				});
			}
			else {
				if (err) {
					return next(err);
				}
				foundCategory[0].articles.push(article);
				req.user.save(function (err, user) {
					if (err) {
						return next(err);
					}
					res.json(article);
				});
			}
		}
		if (!article) {
			var article = new Article(req.body);
			if (!foundCategory.length) {
				article.save(function (err, article) {
					if (err) {
						return next(err);
					}
					var newArticleElement = {
						category: req.body.category,
						articles: []
					}
					newArticleElement.articles.push(article);
					req.user.favouritesDictionary.push(newArticleElement);
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(article);
					});
				});
			}
			else {
				article.save(function (err, article) {
					if (err) {
						return next(err);
					}
					foundCategory[0].articles.push(article);
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(article);
					});
				});
			}
		}
	});
};

module.exports.removeFavArticle = function (req, res, next) {	
		req.user.populate("favouritesDictionary.articles", function (err, user) {
			var foundCategoryIndex,
				foundCategory,
				foundArticleIndex,
				foundArticle;

			foundCategory = req.user.favouritesDictionary.filter(function (elem, i) {
				foundCategoryIndex = i;
				return elem.category === req.params.category;
			});

			if (!foundCategory.length) {
				return res.send({
					error: ERRORS.cant_delete_article_no_such_cat
				});
			}

			foundArticle = foundCategory[0].articles.filter(function (elem, i) {
				foundArticleIndex = i;
				return elem._id == req.params.id;
			});

			if (!foundArticle.length) {
				return res.send({
					error: ERRORS.cant_delete_article_no_such_article
				});
			}

			if (foundCategory[0].articles.length === 1) {
				req.user.favouritesDictionary.splice(foundCategoryIndex, 1);
			}
			else {
				foundCategory[0].articles.splice(foundArticleIndex, 1);
			}

			req.user.save(function (err) {
				if (err) return next(err);
				res.statusCode = 200;
				return res.send();
			});
		});
}

module.exports.getFavArticle = function (req, res, next) {
	Article.findOne({ link: req.body.link }, function (err, article) {
		if (err) {
			console.log("ERROR: " + err);
			return next(err);
		}
		if (!article) {
			res.status(404).send('Not found');
			return;
		}
		res.json(article);
	});
}

module.exports.allFavourites = function (req, res, next) {
	req.user.populate("favouritesDictionary.articles", function (err, user) {
		res.json(user.favouritesDictionary);
	});
}