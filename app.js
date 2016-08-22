'use strict'
var express = require('express'),
	fs = require("fs"),
	app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	path = require('path'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	multer = require('multer'),
	//port = 8080,
	cors = require('cors'),
	logger = require('morgan');

app.use(favicon(path.join(__dirname, 'client', 'assets', 'images', 'favicon.ico')));

require('./server/models/Feeds');
require('./server/models/Articles');
require('./server/models/Users');
require('./server/config/passport');

var routes = require('./server/routes/index');

mongoose.connect('mongodb://localhost/feeds');
mongoose.connection.on('error', function (err) {
	console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});
app.set('port', process.env.NODE_PORT || 8080);
app.set('host', process.env.NODE_IP || 'localhost');

app.use(cors());
app.use(logger('dev'));

app.use(function (req, res, next) { //allow cross origin requests
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static('./client'));
app.use(express.static('./server/uploads'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies
app.use(session({
    secret: 'MY_SECRET',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.static('./client'));
app.use(express.static('./server/uploads'));
app.use('/', routes);
app.use(morgan('dev'));


// mongoose
mongoose.connect('mongodb://localhost/feeds');
mongoose.connection.on('error', function (err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

if (app.get('env') === 'production') {
	app.use(function (req, res, next) {
		var protocol = req.get('x-forwarded-proto');
		protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(app.get('port'), app.get('host'), function () {
	console.log('Server running on port 8080!');
});
module.exports = app;