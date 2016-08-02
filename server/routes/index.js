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

var authCtrl = require('../controllers/authentication');
var articlesCtrl = require('../controllers/articles');
var feedsCtrl = require('../controllers/feeds');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// define user param
router.param('user', feedsCtrl.userParam);
// get user and his feeds
router.get('/users/:user', auth, feedsCtrl.allFeed);

// get all articles
router.get('/users/:user/articles/all/:count', auth, articlesCtrl.all);
// get feeds articles
router.get('/users/:user/articles/feed/:id/:count', auth, articlesCtrl.byFeed);
// get category articles
router.get('/users/:user/articles/category/:cat/:count', auth, articlesCtrl.byCategory);

// add new feed
router.post('/users/:user/addFeed', auth, feedsCtrl.add);
// remove feed
router.delete('/users/:user/deleteFeed/:id', feedsCtrl.remove);

module.exports = router;