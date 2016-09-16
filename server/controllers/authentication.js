var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	moment = require('moment'),
	jwt = require('jwt-simple'),
	config = require('../config/config'),
	request = require('request'),
	qs = require('querystring'),
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
	not_verifyed: 'This email have not approved yeat'
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
					emailToken = randomtoken.generate(16);
					host = req.get('host');
					link = "http://" + req.get('host') + "/#/verify/" + emailToken +"/" + userEmail;
					mailOptions = {
						to : req.body.email,
						subject : "Please confirm your Email account",
						html : "Hello,<br> Please Click on the link to verify your email <strong>" + userEmail + "</strong>.<br><a href=" + link + ">Click here to verify</a>"	
					}
					console.log(mailOptions);

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
					        	console.log(error);
								res.end("error");
						 	} else {
					        	console.log("Message sent: " + response.message);
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
	  		crypto.randomBytes(10, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
	  		});
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
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  'http://' + req.headers.host + '/#/reset/' + token + '/' + user.email + '\n\n' +
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
    	res.redirect('/#/reset/'+ req.params.token + '/' + req.params.user.email);
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
	          			req.logIn(user, function(err) {
	            			done(err, user);
	          			});
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

module.exports.getUserInfo = function (req, res) {
	User.find(req.user, function (err, user) {
		res.send({
			user: user
		});
	});

}
module.exports.putUserInfo = function (req, res) {
	User.findById(req.user, function (err, user) {
		if (!user) {
			return res.status(400).send({
				message: 'User not found'
			});
		}
		user.displayName = req.body.displayName || user.displayName;
		user.email = req.body.email || user.email;
		user.save(function (err) {
			res.status(200).end();
		});
	});
}

module.exports.googleAuth = function (req, res) {
	var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token',
		peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
		params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.GOOGLE_SECRET,
			redirect_uri: req.body.redirectUri,
			grant_type: 'authorization_code'
		};


	request.post(accessTokenUrl, {
		json: true,
		form: params
	}, function (err, response, token) {
		var accessToken = token.access_token,
			headers = {
				Authorization: 'Bearer ' + accessToken
			};
		request.get({
			url: peopleApiUrl,
			headers: headers,
			json: true
		}, function (err, response, profile) {
			if (profile.error) {
				return res.status(500).send({
					message: profile.error.message
				});
			}

			if (req.header('Authorization')) {
				User.findOne({
					google: profile.sub
				}, function (err, existingUser) {
					if (existingUser) {
						return res.status(409).send({
							message: 'There is already a Google account that belongs to you'
						});
					}
					var token = req.header('Authorization').split(' ')[1],
						payload = jwt.decode(token, config.TOKEN_SECRET);
					User.findById(payload.sub, function (err, user) {
						if (!user) {
							return res.status(400).send({
								message: 'User not found'
							});
						}
						user.google = profile.sub;
						user.email = profile.email;
						user.picture = user.picture || profile.picture.replace('sz=100', 'sz=100');
						user.displayName = user.displayName || profile.name;
						user.save(function () {
							var token = createJWT(user);
							console.log('google: ' + token);
							res.send({
								token: token
							});
						});
					});
				});
			} else {

				User.findOne({
					google: profile.sub
				}, function (err, existingUser) {
					if (existingUser) {
						return res.send({
							token: createJWT(existingUser),
							profile: profile
						});
					}
					var user = new User();
					user.email = profile.email;
					user.google = profile.sub;
					user.picture = profile.picture.replace('sz=50', 'sz=200');
					user.displayName = profile.name;
					user.save(function (err) {
						var token = createJWT(user);
						console.log(token + 'server');
						res.send({
							token: token,
							profile: profile,
							user: user
						});
					});
				});
			}
		});
	});
}
module.exports.facebookAuth = function (req, res) {
	var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'],
		accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token',
		graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(','),
		params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.FACEBOOK_SECRET,
			redirect_uri: req.body.redirectUri
		};

	request.get({
		url: accessTokenUrl,
		qs: params,
		json: true
	}, function (err, response, accessToken) {
		if (response.statusCode !== 200) {
			return res.status(500).send({
				message: accessToken.error.message
			});
		}

		request.get({
			url: graphApiUrl,
			qs: accessToken,
			json: true
		}, function (err, response, profile) {
			if (response.statusCode !== 200) {
				return res.status(500).send({
					message: profile.error.message
				});
			}
			if (req.header('Authorization')) {
				User.findOne({
					facebook: profile.id
				}, function (err, existingUser) {
					if (existingUser) {
						return res.status(409).send({
							message: 'There is already a Facebook account that belongs to you'
						});
					}
					var token = req.header('Authorization').split(' ')[1];
					var payload = jwt.decode(token, config.TOKEN_SECRET);
					User.findById(payload.sub, function (err, user) {
						if (!user) {
							return res.status(400).send({
								message: 'User not found'
							});
						}
						user.facebook = profile.id;
						user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
						user.displayName = user.displayName || profile.name;
						user.save(function () {
							var token = createJWT(user);
							res.send({
								token: token
							});
						});
					});
				});
			} else {

				User.findOne({
					facebook: profile.id
				}, function (err, existingUser) {
					if (existingUser) {
						var token = createJWT(existingUser);
						return res.send({
							token: token,
							profile: profile
						});
					}
					var user = new User();
					user.email = profile.email;
					user.facebook = profile.id;
					user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
					user.displayName = profile.name;
					user.save(function () {
						var token = createJWT(user);
						res.send({
							token: token,
							profile: profile
						});
					});
				});
			}
		});
	});
}


module.exports.twitterAuth = function(req, res) {
	var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
	var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
	var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

 	if (!req.body.oauth_token || !req.body.oauth_verifier) {
    	var requestTokenOauth = {
      		consumer_key: config.TWITTER_KEY,
      		client_id: req.body.clientId,
      		consumer_secret: config.TWITTER_SECRET,
      		callback: req.body.redirectUri
    	};
		request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      		var oauthToken = qs.parse(body);
      		res.send(oauthToken);
    	});
  	} else {
    	var accessTokenOauth = {
      		consumer_key: config.TWITTER_KEY,
      		consumer_secret: config.TWITTER_SECRET,
      		token: req.body.oauth_token,
      		verifier: req.body.oauth_verifier
    	};
    	request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {
			accessToken = qs.parse(accessToken);
			var profileOauth = {
        		consumer_key: config.TWITTER_KEY,
        		consumer_secret: config.TWITTER_SECRET,
        		token: accessToken.oauth_token,
        		token_secret: accessToken.oauth_token_secret,
      		};

      	request.get({
        	url: profileUrl,
        	qs: { include_email: true },
        	oauth: profileOauth,
        	json: true
      	}, function(err, response, profile) {

        	if (req.header('Authorization')) {
          		User.findOne({ twitter: profile.id }, function(err, existingUser) {
            		if (existingUser) {
              			return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
            		}

            		var token = req.header('Authorization').split(' ')[1];
            		var payload = jwt.decode(token, config.TOKEN_SECRET);

            		User.findById(payload.sub, function(err, user) {
              			if (!user) {
                			return res.status(400).send({ message: 'User not found' });
              			}
						user.twitter = profile.id;
              			user.displayName = user.displayName || profile.name;
              			user.picture = user.picture || profile.profile_image_url_https.replace('_normal', '');
              			user.save(function () {
              				var token = createJWT(user);
                			res.send({
                 				token: token,
                 				profile: profile  
             				});
              			});
            		});
          		});
        	} else {
          		User.findOne({ twitter: profile.id }, function(err, existingUser) {
            		if (existingUser) {
              			return res.send({ token: createJWT(existingUser) });
            		}

            		var user = new User();
            		user.email = profile.id;
            		user.twitter = profile.id;
            		user.displayName = profile.name;
            		user.picture = profile.profile_image_url_https.replace('_normal', '');
            		user.save(function () {
            			var token = createJWT(user);
              			res.send({ 
              				token: token,
              				profile : profile
              			});
            		});
          		});
        	}
      	});
    	});
  	}
};

module.exports.linkedIdAuth = function(req, res) {
  	var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  	var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  	var params = {
    	code: req.body.code,
    	client_id: req.body.clientId,
    	client_secret: config.LINKEDIN_SECRET,
    	redirect_uri: req.body.redirectUri,
    	grant_type: 'authorization_code'
  	};


  	request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
    	if (response.statusCode !== 200) {
      		return res.status(response.statusCode).send({ message: body.error_description });
    	}
	    var params = {
	      	oauth2_access_token: body.access_token,
	      	format: 'json'
	    };
	    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

		    if (req.header('Authorization')) {
		        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
		          	if (existingUser) {
		            	return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
		          	}
		          	var token = req.header('Authorization').split(' ')[1];
		          	var payload = jwt.decode(token, config.TOKEN_SECRET);
		          	User.findById(payload.sub, function(err, user) {
		 			    if (!user) {
		              		return res.status(400).send({ message: 'User not found' });
		            	}
		            	user.linkedin = profile.id;
		            	user.picture = user.picture || profile.pictureUrl;
		            	user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
		            	user.save(function () {
		              		var token = createJWT(user);
		              			res.send({ 
		              				token: token 
		              			});
		            	});
		          	});
		        });
		    } else {

		        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
		          	if (existingUser) {
		            	return res.send({ token: createJWT(existingUser) });
		          	}
		          	var user = new User();
		          	user.linkedin = profile.id;
		          	user.email = profile.emailAddress;
		          	user.picture = profile.pictureUrl;
		          	user.displayName = profile.firstName + ' ' + profile.lastName;
		          	user.save(function () {
		            	var token = createJWT(user);
		            	res.send({ 
		            		token: token,
		            		profile : profile	
		            	});
		          	});
		        });
		    }
	    });
	});
};

module.exports.unlink = function (req, res) {
	var provider = req.body.provider;
	providers = ['facebook', 'google', 'linkedin','twitter'];
	if (providers.indexOf(provider) === -1) {
		return res.status(400).send({
			message: 'Unknown OAuth Provider'
		});
	}

	User.findById(req.body.id, function (err, user) {
		if (!user) {
			return res.status(400).send({
				message: 'User Not Found'
			});
		}
		user[provider] = undefined;
		user.save(function () {
			res.status(200).end();
		});
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

