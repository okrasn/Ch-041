var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed'),
	Article = mongoose.model('Article'),
	ERRORS = {
		choose_cat: 'Choose category',
		cant_find_user: 'Can\'t find user',
		feed_already_added: 'You have already added this feed',
		feed_not_found: 'Feed not found',
		enter_feed_url: 'Enter feed url',
		article_not_found: 'Article not found',
		server_error: 'Server error',
		internal_error: 'Internal error(%d): %s',
		cant_delete_feed_no_such_cat: "Cant delete such feed, no such category found within your account",
		cant_delete_feed_no_such_feed: "Cant delete such feed, no such feed found within your account"
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
};

module.exports.allFeed = function (req, res, next) {
	console.log(req.user);
	req.user.populate("feedsDictionary.feeds", function (err, user) {
		res.json(user.feedsDictionary);
	});
}

module.exports.getFeedData = function (req, res, next) {
	if (!req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).send('Invalid feed');
		return;
	}
	Feed.findById(req.body.id, function (err, feed) {
		if (err) {
			console.log("ERROR: " + err);
			return next(err);
		}
		if (!feed) {
			res.status(404).send('Not found');
			return;
		}
		else {
			res.json(feed);
		}
	});

}

module.exports.add = function (req, res, next) {
	if (req.body.rsslink === undefined) {
		return res.status(400).json({
			message: ERRORS.enter_feed_url
		});
	}
	if (req.body.category === undefined) {
		return res.status(400).json({
			message: ERRORS.choose_cat
		});
	}

	Feed.findOne({ rsslink: req.body.rsslink }, function (err, feed) {
		if (err) {
			return next(err);
		}

		var foundCategory = req.user.feedsDictionary.filter(function (elem) {
			return elem.category === req.body.category;
		});

		if (feed) {
			if (!foundCategory.length) {
				if (err) {
					return next(err);
				}
				var newFeedElement = {
					category: req.body.category,
					feeds: []
				}
				newFeedElement.feeds.push(feed);
				req.user.feedsDictionary.push(newFeedElement);
				req.user.save(function (err, user) {
					if (err) {
						return next(err);
					}
					res.json(feed);
				}); 
			}
			else {
				if (err) {
					return next(err);
				}
				foundCategory[0].feeds.push(feed);
				req.user.save(function (err, user) {
					if (err) {
						return next(err);
					}
					res.json(feed);
				});
			}
		}
		if (!feed) {
			var feed = new Feed(req.body);
			if (!foundCategory.length) {
				feed.save(function (err, feed) {
					if (err) {
						return next(err);
					}
					var newFeedElement = {
						category: req.body.category,
						feeds: []
					}
					newFeedElement.feeds.push(feed);
					req.user.feedsDictionary.push(newFeedElement);
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(feed);
					});
				});
			}
			else {
				feed.save(function (err, feed) {
					if (err) {
						return next(err);
					}
					foundCategory[0].feeds.push(feed);
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(feed);
					});
				});
			}
		}
	});
};

module.exports.remove = function (req, res, next) {
	req.user.populate("feedsDictionary.feeds", function (err, user) {
		var foundCategoryIndex,
			foundCategory,
			foundFeedIndex,
			foundFeed;

		foundCategory = req.user.feedsDictionary.filter(function (elem, i) {
			foundCategoryIndex = i;
			return elem.category === req.params.category;
		});

		if (!foundCategory.length) {
			return res.send({
				error: ERRORS.cant_delete_feed_no_such_cat
			});
		}

		foundFeed = foundCategory[0].feeds.filter(function (elem, i) {
			foundFeedIndex = i;
			return elem._id == req.params.id;
		});

		if (!foundFeed.length) {
			return res.send({
				error: ERRORS.cant_delete_feed_no_such_feed
			});
		}

		if (foundCategory[0].feeds.length === 1) {
			req.user.feedsDictionary.splice(foundCategoryIndex, 1);
		}
		else {
			foundCategory[0].feeds.splice(foundFeedIndex, 1);
		}

		req.user.save(function (err) {
			if (err) return next(err);
			res.statusCode = 200;
			return res.send();
		});
	});
}

module.exports.setCategoryOrder = function (req, res, next) {
	var newFeedsDictionary = [],
		lookup = {};
	for (var i = 0, array = req.user.feedsDictionary; i < array.length; i++) {
		lookup[array[i].category] = array[i];
	}
	
	for (var i = 0; i < req.body.newCategories.length; i++) {
		newFeedsDictionary.push(lookup[req.body.newCategories[i]]);
	}
	req.user.feedsDictionary = newFeedsDictionary;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}

module.exports.setFavsCategoryOrder = function (req, res, next) {
	var newFavsDictionary = [],
		lookup = {};
	for (var i = 0, array = req.user.favouritesDictionary; i < array.length; i++) {
		lookup[array[i].category] = array[i];
	}

	for (var i = 0; i < req.body.newCategories.length; i++) {
		newFavsDictionary.push(lookup[req.body.newCategories[i]]);
	}
	req.user.favouritesDictionary = newFavsDictionary;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}