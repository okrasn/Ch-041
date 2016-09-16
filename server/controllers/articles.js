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
		var currentArticle = article;
		req.user.populate("favouritesDictionary.articles", function (err, user) {
			var foundCategory = null;
			for (var i = 0; i < req.user.favouritesDictionary.length; i++) {
				if (req.user.favouritesDictionary[i].category === req.body.category) {
					foundCategory = req.user.favouritesDictionary[i];
				}
				for (var j = 0; j < req.user.favouritesDictionary[i].articles.length; j++) {
					if (req.user.favouritesDictionary[i].articles[j].link === req.body.link) {
						return res.status(400).json({
							message: ERRORS.fav_article_already_added
						});
					}
				}
			}

			if (currentArticle) {
				currentArticle.totalSubscriptions++;
				currentArticle.currentSubscriptions++;
				currentArticle.save(function (err, currentArticle) {
					if (err) {
						return next(err);
					}
					if (!foundCategory) {
						var newArticleElement = {
							category: req.body.category,
							articles: []
						}
						newArticleElement.articles.push(currentArticle);
						req.user.favouritesDictionary.push(newArticleElement);
					}
					else {
						foundCategory.articles.push(currentArticle);
					}
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(currentArticle);
					});
				});
			}
			if (!currentArticle) {
				var article = new Article(req.body);
				article.totalSubscriptions = 1;
				article.currentSubscriptions = 1;
				article.save(function (err, article) {
					if (err) {
						return next(err);
					}
					if (!foundCategory) {
						var newArticleElement = {
							category: req.body.category,
							articles: []
						}
						newArticleElement.articles.push(article);
						req.user.favouritesDictionary.push(newArticleElement);
					}
					else {
						foundCategory.articles.push(article);
					}
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(article);
					});
				});
			}
		});
	});
};

module.exports.removeFavArticle = function (req, res, next) {
	req.user.populate("favouritesDictionary.articles", function (err, user) {
		var foundCategoryIndex,
			foundCategory = null,
			foundArticleIndex,
			foundArticle = null;

		for (var i = 0, array = req.user.favouritesDictionary; i < array.length; i++) {
		    if (array[i].category == req.params.category) {
		        foundCategory = array[i];
		        foundCategoryIndex = i;
		        for (var j = 0, articles = array[i].articles; j < articles.length; j++) {
		            if (articles[j]._id == req.params.id) {
		                foundArticle = articles[j];
		                foundArticleIndex = j;
		            }
		        }
		    }
		}

		if (!foundCategory) {
			return res.send({
				error: ERRORS.cant_delete_article_no_such_cat
			});
		}

		if (!foundArticle) {
			return res.send({
				error: ERRORS.cant_delete_article_no_such_article
			});
		}
		Article.findById(foundCategory.articles[foundArticleIndex], function (err, article) {
			if (err) {
				return next(err);
			}
			if (!article) {
				return next(new Error(ERRORS.article_not_found));
			}
			if (article.currentSubscriptions > 0) {
				article.currentSubscriptions--;
			}
			article.save(function (err) {
				if (err) return next(err);
			});
		});

		if (foundCategory.articles.length === 1) {
			req.user.favouritesDictionary.splice(foundCategoryIndex, 1);
		}
		else {
			foundCategory.articles.splice(foundArticleIndex, 1);
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

module.exports.getPopularArticles = function (req, res, next) {

}