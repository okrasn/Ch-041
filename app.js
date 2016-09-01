'use strict'
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
	logger = require('morgan'),
	nodemailer = require('nodemailer'),
	User = require('./server/models/Users'),
	mongoose = require('mongoose'),
	flash = require('express-flash'),
	nev = require('email-verification')(mongoose);

// nev.configure({
// 	verificationURL: 'localhost/email-verification/${URL}',
// 	URLLength: 50,

// 	// mongo-stuff
// 	persistentUserModel: null,
// 	tempUserModel: null,
// 	tempUserCollection: 'temporary_users',
// 	emailFieldName: 'email',
// 	passwordFieldName: 'password',
// 	URLFieldName: 'GENERATED_VERIFYING_URL',
// 	expirationTime: 86400,

// 	// emailing options
// 	transportOptions: {
// 		service: 'Gmail',
// 		auth: {
// 			user: 'rss.reader.app.ch.041@gmail.com',
// 			password: 'password'
// 		}
// 	},
// 	verifyMailOptions: {
// 		from: 'Do Not Reply <rss.reader.app.ch.041@gmail.com>',
// 		subject: 'Confirm your account',
// 		html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
// 				'paste the following link into your browser:</p><p>${URL}</p>',
// 		text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
// 	},
// 	shouldSendConfirmation: true,
// 	confirmMailOptions: {
// 		from: 'Do Not Reply <rss.reader.app.ch.041@gmail.com>',
// 		subject: 'Successfully verified!',
// 		html: '<p>Your account has been successfully verified.</p>',
// 		text: 'Your account has been successfully verified.'
// 	},

// 	hashingFunction: null,
// });
// var smtpTransport = nodemailer.createTransport({
// 	from: 'rss.reader.app.ch.041@gmail.com',
// 	options: {
// 		host: 'smtp.gmail.com',
// 		port: 465,
// 		auth: {
// 			user: 'your_smtp_username',
// 			pass: 'your_smtp_email'
// 		}
// 	}
// });

//================================================================================
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

app.use(cors());
app.use(logger('dev'));

app.use(function (req, res, next) { //allow cross origin requests
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.static('./client'));
app.use(express.static('./server/uploads'));
app.use('/', routes);

//catch 404 and forward to error handler
// app.use(function (req, res, next) {
// 	var err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// // error handlers
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
// 	app.use(function (err, req, res, next) {
// 		res.status(err.status || 500);
// 		res.render('error', {
// 			message: err.message,
// 			error: err
// 		});
// 	});
// }

if (app.get('env') === 'production') {
	app.use(function (req, res, next) {
		var protocol = req.get('x-forwarded-proto');
		protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
	});
}

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
// 	res.status(err.status || 500);
// 	res.render('error', {
// 		message: err.message,
// 		error: {}
// 	});
// });

app.listen(8080, function () {
	console.log('Server running on port 8080!');
});
module.exports = app;