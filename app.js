'use strict'
var express = require('express'),
    fs = require("fs"),
    app = express(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    path = require('path'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

require('./server/models/Feeds');
require('./server/models/Articles');
require('./server/models/Users');

require('./server/config/passport');

var routes = require('./server/routes/index');

mongoose.connect('mongodb://localhost/feeds');

//app.set('views', path.join(__dirname, 'client'));
//app.set('view engine', 'html');

app.use(express.static('./client'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.use(passport.initialize());
app.use('/', routes);

app.use(morgan('dev'));

app.listen(8080, function () {
    console.log('Server running on port 8080!');
});

module.exports = app;
/*

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'my_precious' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/client'));
});
passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL,
  passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));
app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ] }
));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });
  */