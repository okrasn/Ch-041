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

//router.get('/', auth, function (req, res) {
////    res.render('home', {
////        user: req.user
////    });
//});
router.post('/upload', auth, profCtrl.upload);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/changePassword', auth, authCtrl.changePassword);

// define user param
router.param('user', feedsCtrl.userParam);
// get user and his feeds
router.get('/users/:user', auth, feedsCtrl.allFeed);
router.get('/users/:user/favourites', auth, articlesCtrl.allFavourites);

// add new feed
router.post('/users/:user/addFeed', auth, feedsCtrl.add);
router.post('/users/:user/setCategoryOrder', auth, feedsCtrl.setCategoryOrder);
router.post('/users/:user/addFavArticle', auth, articlesCtrl.addFavArticle);

// remove feed
router.delete('/users/:user/deleteFeed/:id', auth, feedsCtrl.remove);
router.delete('/users/:user/deleteFavFeed/:id', auth, articlesCtrl.removeFavArticle);

module.exports = router;