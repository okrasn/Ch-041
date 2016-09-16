'use strict';
var express = require('express'),
	fs = require("fs"),
	app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	path = require('path'),
	morgan = require('morgan'),
	passport = require('passport'),
	multer = require('multer'),
	cors = require('cors'),
	logger = require('morgan');

app.use(favicon(path.join(__dirname, 'server', 'assets', 'images', 'favicon.ico')));
require('./server/models/Feeds');
require('./server/models/Articles');
require('./server/models/Users');
require('./server/models/Advised');
require('./server/config/passport');

var routes = require('./server/routes/index');

app.set('port', process.env.PORT || 8080);
app.set('base url', process.env.URL || 'http://localhost');
//'mongodb://feedsUser:Ch-041feedsUser@ds044979.mlab.com:44979/feeds'
mongoose.connect(process.env.DB_URL || 'mongodb://feedsUser:Ch-041feedsUser@ds044979.mlab.com:44979/feeds');
mongoose.connection.on('error', function (err) {
	console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});
app.use(cors());
app.use(function (req, res, next) { //allow cross origin requests
	res.header('Access-Control-Allow-Origin', process.env.allowOrigin || 'http://localhost');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
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
app.use(express.static(__dirname + '/dist'));
app.use(express.static('./server/uploads'));
app.use('/', routes);

 //catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	console.log("development");
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

if (app.get('env') === 'production') {
	console.log("production");
	app.use(function (req, res, next) {
		var protocol = req.get('x-forwarded-proto');
		protocol === 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
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

app.listen(app.get('port'));
module.exports = app;