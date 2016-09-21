var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	moment = require('moment'),
	jwt = require('jwt-simple'),
	config = require('../config/config'),
	request = require('request'),
	nev = require('email-verification')(mongoose),
	async = require('async'),
	crypto = require('crypto'),
	randomtoken = require('rand-token'),
	bcrypt = require('bcryptjs'),
	flash = require('express-flash'),
	path = require('path'),
	nodemailer = require('nodemailer'),
	emailToken, mailOptions, host, link, userEmail,
	smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
		auth: {
			user: 'rss.reader.app.ch.041@gmail.com',
			pass: 'rssreader'
		}
	}),
	arrayOfEmails = [],

ERRORS = {
	fill_out_fields: 'Please fill out all fields',
	user_not_found: 'User not found',
	pass_or_token_not_match: 'Passwords or tokens does\'t match',
	pass_not_match: 'Passwords does\'t match',
	same_pass: 'Please enter new password',
	pass_incorrect: 'Entered password is incorrect',
	user_exist: 'That user already exists',
	invalid_data: 'Invalid email or password',
	email_not_found: 'User with this email not found',
	not_local_user: 'User with this email not a local created',
	email_verification: 'First you have to approve you email. We are send verification link to your email',
	not_verifyed: 'This email have not approved yet'
};

function createJWT(user) {
	var payload = {
		sub: user._id,
		email: user.email,
		iat: moment().unix(),
		exp: moment().add(1, 'days').unix()
	};
	return jwt.encode(payload, config.TOKEN_SECRET);
}

function createEmailJWT (email) {
	var payload = {
		verifEmail: email,
		iat: moment().unix(),
		exp: moment().add(1, 'hours').unix()
	};
	return jwt.encode(payload, config.TOKEN_SECRET);
}

module.exports.register = function (req, res) {
	var passAccepted = false;

	if(req.body.verifyEmail){
		req.body.repPassword = req.body.password;
	}

	if (!req.body.email || !req.body.password || !req.body.repPassword) {
		return res.status(400).json({
			message: ERRORS.fill_out_fields
		});
	}
	if (req.body.password !== req.body.repPassword) {
		return res.status(400).json({
			message: ERRORS.pass_not_match
		});
	}
	if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/.test(req.body.password)) {
		passAccepted = true;
	}
	else {
		return res.status(400).json({
			message: ERRORS.pass_not_match
		});
	}
	if (passAccepted) {
		
		User.findOne({email: req.body.email}, function (err, existingUser) {
				
				if (!req.body.verifyEmail && req.body.counter === 0) {
					userEmail = req.body.email;
					emailToken = createEmailJWT(req.body.email);
					host = req.get('host');
					link = "http://" + req.get('host') + "/#/verify/" + emailToken;
					mailOptions = {
						to : req.body.email,
						subject : "Please confirm your Email account",
						html : "Hello,<br> Please Click on the <a href=" + link + ">link verification</a> to verify your email.<br>"	
					}

					var user = new User({
						emailVerification: false,
						email : req.body.email,
						displayName: req.body.displayName,
						password: req.body.password,
						tempPassword: req.body.password,
						emailToken: emailToken
					});

					if(req.body.email !== arrayOfEmails[0]){
						smtpTransport.sendMail(mailOptions, function(error, response){
							if(error){
								res.end("error");
							} else {
								arrayOfEmails.push(req.body.email);
								res.end("sent");
							}
						});
					}	
					user.save(function (err, result) {
						if (err) {
							return res.status(409).send({
								message: 'Email is already taken'
							});
						}
						return res.status(400).json({
							message: ERRORS.email_verification,
							user : user
						});
					});
				}
				
				if(existingUser && !req.body.verifyEmail && req.body.counter !== 0){
					return res.status(400).json({
						message : 'Please check your email to continue registration'
					});
				}
				if (existingUser && existingUser.verifiedUser && (!existingUser.google || !existingUser.facebook || !existingUser.twitter || !existingUser.linkedin )) {
					return res.status(409).json({
						message: 'Email is already taken'
					});
				}

				if (existingUser && !existingUser.verifiedUser && req.body.verifyEmail) {
					existingUser.emailVerification = true;
					existingUser.verifiedUser = true;
					existingUser.date_of_signup = new Date();
					if( (req.body.password === existingUser.tempPassword)  && (existingUser.emailToken === req.body.verifyEmail)){
						existingUser.tempPassword = '';	
						existingUser.save(function (err, result) {
							if (err) {
								res.status(500).json({
									message: err.message
								});
							}
							res.send({
								token: createJWT(result)
							});
						});	
					} else {
						res.status(400).json({
							message : ERRORS.pass_or_token_not_match
						});
					}
				}
		});
	}
};

module.exports.login = function (req, res) {
	User.findOne({
		email: req.body.email
	}, '+password', function (err, user) {
		if (!user) {
			return res.status(401).send({
				message: ERRORS.invalid_data
			});
		}
		if (!user.emailVerification) {
			return res.status(401).send({
				message: ERRORS.not_verifyed
			});		
		}
		user.comparePassword(req.body.password, function (err, isMatch) {
			if (!isMatch) {
				return res.status(401).send({
					pwd: user.password,
					message: ERRORS.invalid_data
				});
			}
			res.send({
				token: createJWT(user),
				user: user
			});
		});
	});
};

module.exports.forgotPass = function(req, res) {
	async.waterfall([
		function(done) {
			var token = createEmailJWT(req.body.email);
			done(null, token);
		},
	function(token, done) { 
			User.findOne({email: req.body.email }, function(err, user) {
				if(!user){
					return res.status(404).send({
						message: ERRORS.email_not_found
					});
				}
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			user.save(function(err) {
				done(err, token, user);
			});
			});
	},
	function(token, user, done) {
		var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'Gmail',
			auth: {
				user: 'rss.reader.app.ch.041@gmail.com',
				pass: 'rssreader'
			}
		});
		var mailOptions = {
			to: user.email,
			from: 'passwordreset@demo.com',
			subject: 'Node.js Password Reset',
			html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  '<a href="http://' + req.headers.host + '/#/reset/' + token +  '">http://' + req.headers.host + '/#/reset/' + token + '</a>\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
			done(err, 'done');
		});
	}
	], function(err) {
		if (err) return next(err);
			res.status(200);
			return res.redirect('/#/forgot');
	});
	
};

module.exports.reset = function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		res.redirect('/#/reset/'+ req.params.token);
	});
}

module.exports.resetPost = function(req, res) {
	var passRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
				if(req.body.pas !== req.body.confirm){
					return res.status(400).send({
						message: ERRORS.pass_not_match
					})	
				}
				if (passRequirements.test(req.body.pas)) {
					user.password = req.body.pas;
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save(function(err) {
						done(err, user);
					});
				} else {
					return res.status(400).json({
						message: ERRORS.pass_not_match
					});
				}
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'Gmail',
				auth: {
					user: 'rss.reader.app.ch.041@gmail.com',
					pass: 'rssreader'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'rss.reader.app.ch.041@gmail.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				done(err);
			});
		}
	], function(err) {
		res.redirect('/#/home');
	});
};

module.exports.changePassword = function (req, res, next) {
	if (!req.body.currentPass || !req.body.newPass || !req.body.newPassRepeat) {
		return res.status(400).json({
			message: ERRORS.fill_out_fields
		});
	}

	if (req.body.newPass !== req.body.newPassRepeat) {
		return res.status(400).json({
			message: ERRORS.pass_not_match
		});
	}
	if (req.body.newPass == req.body.newPassRepeat && req.body.newPass == req.body.currentPass) {
		return res.status(400).json({
			message: ERRORS.same_pass
		});
	}

	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (user === undefined) {
			return res.status(400).json({
				message: ERRORS.user_not_found
			});
		} else {
			if (req.body.currentPass) {
				user.password = req.body.newPass;

				user.save(function (err) {
					if (err) {
						return next(err);
					}
					res.status(200);
					res.json({
						"token": createJWT(user)
					});

				});
			} else {
				return res.status(400).json({
					message: ERRORS.pass_incorrect
				});
			}
		}
	});
};

