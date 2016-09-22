var moment = require('moment'),
	jwt = require('jwt-simple'),
	nodemailer = require('nodemailer');


module.exports = {
	MONGO_URI: process.env.MONGO_URI || 'localhost',
	TOKEN_SECRET: process.env.TOKEN_SECRET || '496c59a0260a0c999ae39eccdff5ff03_rss',

	// OAuth 2.0
	FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '413152de5ff6197790927d4052263ab1',
	GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'pGT_4I5yjrhPGyohUyTEKsqe',

	LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || '7pYAnN0nJf8ZiDVB',
	// OAuth 1.0
	TWITTER_KEY: process.env.TWITTER_KEY || 'dMtO7Tp6iLeG1xI1cknfuwMQd',
	TWITTER_SECRET: process.env.TWITTER_SECRET || '9ld2ELLenIzJCVYICQwhqFkAtALYijgypuAomgsDer1FzCX62E',
	
	regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/,
	
	createJWT: function (user) {
		var payload = {
			sub: user._id,
			email: user.email,
			iat: moment().unix(),
			exp: moment().add(1, 'days').unix()
		};
		return jwt.encode(payload, this.TOKEN_SECRET);
	},
	createEmailJWT: function (email) {
	var payload = {
		verifEmail: email,
		iat: moment().unix(),
		exp: moment().add(1, 'hours').unix()
	};
	return jwt.encode(payload, this.TOKEN_SECRET);
	},
	ERRORS: {
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
		not_verifyed: 'This email have not approved yet',
		email_taken_or_not_approved: 'Email is already taken or not approved yet',
		check_your_email: 'Please check your email to continue registration',
		email_taken: 'Email is already taken'
	},
	smtpTransport : nodemailer.createTransport("SMTP",{
	service: "Gmail",
		auth: {
			user: 'rss.reader.app.ch.041@gmail.com',
			pass: 'rssreader'
		}
	})

}