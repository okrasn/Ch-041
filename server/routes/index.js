var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    jwt = require('jwt-simple'),
    Article = mongoose.model('Article'),
    Feed = mongoose.model('Feed'),
    User = mongoose.model('User'),
	config = require('../config/config');

var authCtrl = require('../controllers/authentication'),
    articlesCtrl = require('../controllers/articles'),
    feedsCtrl = require('../controllers/feeds'),
    profCtrl = require('../controllers/profile');

router.post('/upload', profCtrl.upload);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/changePassword', authCtrl.changePassword);
//Auth
router.post('/auth/google', authCtrl.googleAuth);
router.post('/auth/facebook', authCtrl.facebookAuth);
router.post('/auth/unlink', authCtrl.unlink);
router.get('/api/me', authCtrl.getUserInfo);
router.put('/api/me', authCtrl.putUserInfo);

// define user param
router.param('user', feedsCtrl.userParam);
// get user and his feeds
router.get('/users/:user', feedsCtrl.allFeed);
router.get('/users/:user/favourites', articlesCtrl.allFavourites);

// add new feed
router.post('/users/:user/addFeed', auth, feedsCtrl.add);
router.post('/users/:user/setCategoryOrder', auth, feedsCtrl.setCategoryOrder);
router.post('/users/:user/setFavsCategoryOrder', auth, feedsCtrl.setFavsCategoryOrder);
router.post('/users/:user/addFavArticle', auth, articlesCtrl.addFavArticle);

// remove feed
router.delete('/users/:user/deleteFeed/:id', feedsCtrl.remove);
router.delete('/users/:user/deleteFavFeed/:id', articlesCtrl.removeFavArticle);

module.exports = router;