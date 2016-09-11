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
		console.log("User param");
		console.log(user);
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
	req.user.populate("feedsDictionary.feeds", function (err, user) {
		res.json(user.feedsDictionary);
	});

	//for (var i = 0; i < req.user.feedsDictionary.length; i++){
	//	req.user.feedsDictionary[i].populate("feeds", function (err, feeds) {
	//		console.log("feeds");
	//		console.log(feeds);
	//	});
	//};

	//req.user.populate("feedsDictionary", function (err, feeds) {
	//    console.log("dfadsfas");
	//	console.log(feeds);
	//});


	//req.user.populate('feeds', function (err, user) {
	//	if (err) {
	//		console.log("ERROR: " + err);
	//		return next(err);
	//	}

	//	// Data will be storred in dictionary with categories as keys and feeds as values
	//	var feedsDictionary = [];
	//	var containsKey = function (key) {
	//		for (var i = 0; i < feedsDictionary.length; i++) {
	//			if (feedsDictionary[i].key === key) {
	//				return i;
	//			}
	//		}
	//		return -1;
	//	}
	//	// Push categories as keys
	//	for (var i = 0; i < user.categories.length; i++) {
	//		feedsDictionary.push({
	//			key: user.categories[i],
	//			values: []
	//		});
	//	}
	//	// Push feeds as values
	//	for (var i = 0; i < user.feeds.length; i++) {
	//		var j = containsKey(user.feeds[i].category);
	//		if (j >= 0) {
	//			feedsDictionary[j].values.push(user.feeds[i]);
	//		}
	//	}
	//	res.json(feedsDictionary);
	//});
}

module.exports.getFeedData = function (req, res, next) {
	if (!req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).send('Not found');
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
			console.log("ERR");
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
				console.log(foundCategory[0]);
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
				// add to existing category
			}
			// alredy have such feed in database
			console.log("feed exist in database");
		}
		if (!feed) {
			// no such feed in database
			var feed = new Feed(req.body);
			if (!foundCategory.length) {
				console.log("cat not exist");
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
				console.log(foundCategory[0]);
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
				// add to existing category
			}
			console.log("feed doesnt exist in database");
		}
	});
};

module.exports.remove = function (req, res, next) {
	var foundCategoryIndex;
	var foundCategory = req.user.feedsDictionary.filter(function (elem, i) {
		foundCategoryIndex = i;
		return elem.category === req.params.category;
	});

	if(!foundCategory.length){
		return res.send({
			error: ERRORS.cant_delete_feed_no_such_cat
		}); 
	}

	var foundFeedIndex;
	var foundFeed = foundCategory[0].feeds.filter(function (elem, i) {
		foundFeedIndex = i;
		return elem.$oid == req.params.id;
	});

	if(!foundFeed.length){
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
	});

	//for (var i = 0; i < user.feeds.length; i++) {
	//	if (foundCategory[0].feeds[i].$oid === req.params.id) {
	//		foundCategory[0].feeds.splice(i, 1);
	//		if (!foundCategory[0].feeds.length) {

	//		}
	//		req.user.save(function (err) {
	//			if (err) return next(err);
	//		});
	//	}
	//}

	//req.user.populate('feeds', function (err, user) {
	//	// First, delete feed record from user feedsDictionary array 
	//	for (var i = 0; i < user.feeds.length; i++) {
	//		if (user.feeds[i] === req.params.id) {
	//			user.feeds.splice(i, 1);
	//			user.save(function (err) {
	//				if (err) return next(err);
	//			});
	//		}
	//	}

	//	// Delete feed from database
	//	Feed.findById(req.params.id, function (err, feed) {
	//		var catExist = false;
	//		for (var i = 0; i < user.feeds.length; i++) {
	//			if (user.feeds[i].category === feed.category && user.feeds[i].rsslink !== feed.rsslink) {
	//				catExist = true;
	//			}
	//		}
	//		if (!catExist) {
	//			for (var i = 0; i < user.categories.length; i++) {
	//				if (feed.category === user.categories[i]) {
	//					user.categories.splice(i, 1);
	//					user.save(function (err) {
	//						if (err) return next(err);
	//					});
	//				}
	//			}
	//		}
	//		if (!feed) {
	//			res.statusCode = 404;
	//			return res.send({
	//				error: ERRORS.feed_not_found
	//			});
	//		}
	//		return feed.remove(function (err) {
	//			if (user.categories.indexOf(req.body.category) === -1) {
	//				user.categories.push(req.body.category);
	//			}
	//			if (!err) {
	//				return res.send({
	//					status: 'OK'
	//				});
	//			} 
	//			res.statusCode = 500;
	//			log.error(ERRORS.internal_error, res.statusCode, err.message);
	//			return res.send({
	//				error: ERRORS.feed_not_found
	//			});
	//		});
	//	});
	//});
}

module.exports.setCategoryOrder = function (req, res, next) {
	req.user.categories = req.body.newCategories;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}

module.exports.setFavsCategoryOrder = function (req, res, next) {
	req.user.favCategories = req.body.newCategories;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}