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

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/changePassword', authCtrl.changePassword);
//Auth
router.post('/users/:user/changeColorTheme', profCtrl.changeColorTheme);
router.post('/auth/google', authCtrl.googleAuth);
router.post('/auth/facebook', authCtrl.facebookAuth);
router.post('/auth/twitter', authCtrl.twitterAuth);
router.post('/auth/unlink', authCtrl.unlink);
router.get('/api/me', authCtrl.getUserInfo);
router.put('/api/me', authCtrl.putUserInfo);

// define user param
router.param('user', feedsCtrl.userParam);
// get user and his feeds
router.get('/users/:user', feedsCtrl.allFeed);
router.get('/users/:user/favourites', articlesCtrl.allFavourites);
router.get('/users/:user/advicedFeeds', feedsCtrl.getAdvicedFeeds);
router.get('/users/:user/advicedArticles', articlesCtrl.getAdvicedArticles);

// add new feed
router.post('/users/:user/addFeed', feedsCtrl.add);
router.post('/users/:user/setCategoryOrder', feedsCtrl.setCategoryOrder);
router.post('/users/:user/setFavsCategoryOrder', feedsCtrl.setFavsCategoryOrder);
router.post('/users/:user/addFavArticle', articlesCtrl.addFavArticle);
router.post('/users/:user/getFavArticle', articlesCtrl.getFavArticle);
router.post('/users/:user/getFeedData', feedsCtrl.getFeedData);
router.post('/users/:user/upload', profCtrl.upload);

// remove feed
router.delete('/users/:user/deleteFeed/:id/:category', feedsCtrl.remove);
router.delete('/users/:user/deleteFavFeed/:id/:category', articlesCtrl.removeFavArticle);

module.exports = router;