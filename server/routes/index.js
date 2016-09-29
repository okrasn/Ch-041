var mongoose = require('mongoose'),
	express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	jwt = require('jwt-simple'),
	Article = mongoose.model('Article'),
	Feed = mongoose.model('Feed'),
	User = mongoose.model('User'),
	config = require('../config/config'),
	authCtrl = require('../controllers/authentication'),
	articlesCtrl = require('../controllers/articles'),
	feedsCtrl = require('../controllers/feeds'),
	profCtrl = require('../controllers/profile');


var auth = function (req, res, next) {
	console.log("auth");
	var token = req.body.token || req.params.token || req.headers['authorization'];
	// decode token
	if (token) {
		token = token.replace('Bearer ', '');
		var decoded = jwt.decode(token, config.TOKEN_SECRET);
		// verifies secret and checks exp
		if (decoded) {
			if (new Date(decoded.exp) < new Date()) {
				return res.status(403).send({
					success: false,
					message: 'Session token expired'
				});
			}
			else {
				User.findById(decoded.sub, function (err, user) {
					if (err) {
						return next(err);
					}
					if (!user) {
						return next(new Error('Can\'t find user'));
					}
					req.user = user;
					return next();
				});
			}
		}
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No auth token provided.'
		});
	}
}

router.get('/reset/:token', authCtrl.reset);
router.post('/register', authCtrl.register);
router.post('/forgot', authCtrl.forgotPass);
router.post('/reset/:token', authCtrl.resetPost);
router.post('/login', authCtrl.login);
router.post('/changePassword', authCtrl.changePassword);

//Secure routes
router.post('/auth/google', authCtrl.googleAuth);
router.post('/auth/facebook', authCtrl.facebookAuth);
router.post('/auth/twitter', authCtrl.twitterAuth);
router.post('/auth/linkedin', authCtrl.linkedIdAuth);
router.post('/auth/unlink', authCtrl.unlink);
router.get('/api/me', authCtrl.getUserInfo);
router.put('/api/me', authCtrl.putUserInfo);

router.post('/changeColorTheme', auth, profCtrl.changeColorTheme);

// get user and feeds
router.get('/feeds', auth, feedsCtrl.allFeed);
router.get('/getSingleFeed/:id', auth, feedsCtrl.getSingleFeed);
router.get('/favourites', auth, articlesCtrl.allFavourites);
router.get('/advicedFeeds', auth, feedsCtrl.getAdvicedFeeds);
router.get('/advicedArticles', auth, articlesCtrl.getAdvicedArticles);

router.post('/addFeed', auth, feedsCtrl.add);
router.post('/setCategoryOrder', auth, feedsCtrl.setCategoryOrder);
router.post('/setFeedsOrder', auth, feedsCtrl.setFeedsOrder);
router.post('/setFavsCategoryOrder', auth, feedsCtrl.setFavsCategoryOrder);
router.post('/addFavArticle', auth, articlesCtrl.addFavArticle);
router.post('/getFavArticle', auth, articlesCtrl.getFavArticle);
router.post('/upload', auth, profCtrl.upload);
router.post('/changeFeedCategory', auth, feedsCtrl.changeFeedCategory);

// remove feed
router.delete('/deleteFeed/:id', auth, feedsCtrl.remove);
router.delete('/deleteFavFeed/:id', auth, articlesCtrl.removeFavArticle);

module.exports = router;