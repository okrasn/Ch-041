var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    jwt = require('express-jwt'),
    Article = mongoose.model('Article'),
    Feed = mongoose.model('Feed'),
    User = mongoose.model('User');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var authCtrl = require('../controllers/authentication'),
    articlesCtrl = require('../controllers/articles'),
    feedsCtrl = require('../controllers/feeds'),
    profCtrl = require('../controllers/profile');

router.post('/upload',auth, profCtrl.upload);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// define user param
router.param('user', feedsCtrl.userParam);
// get user and his feeds
router.get('/users/:user', auth, feedsCtrl.allFeed);
router.get('/users/:user/favourites', auth, feedsCtrl.allFavourites);

//// get all articles
//router.get('/users/:user/articles/all/:count', auth, articlesCtrl.all);
//// get feeds articles
//router.get('/users/:user/articles/feed/:id/:count', auth, articlesCtrl.byFeed);
//// get category articles
//router.get('/users/:user/articles/category/:cat/:count', auth, articlesCtrl.byCategory);

// add new feed
router.post('/users/:user/addFeed', auth, feedsCtrl.add);
router.post('/users/:user/addFavArticle', auth, feedsCtrl.addFavArticle);
// remove feed
router.delete('/users/:user/deleteFeed/:id', auth, feedsCtrl.remove);
router.delete('/users/:user/deleteFavFeed/:id', auth, feedsCtrl.removeFavArticle);

module.exports = router;