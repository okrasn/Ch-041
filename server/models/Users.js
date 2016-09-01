var mongoose = require('mongoose'),
	crypto = require('crypto'),
	jwt = require('jwt-simple'),
	bcrypt = require('bcryptjs'),
	config = require('../config/config'),
	
	userSchema = new mongoose.Schema({
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: { type: String, select: false },
		local: {
			email : String,
			password : String
		},
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		displayName: String,
		picture : String,
		facebook: String,
		google: String,
		hash: String,
		salt: String,
		avatar: String,
		categories: [String],
		favCategories: [String],
		feeds: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Feed'
		}],
		favourites: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Article'
		}]
	});

userSchema.pre('save', function(next) {
	var user = this;
	var SALT_FACTOR = 5;

	if (!user.isModified('password')) return next();

  	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    	if (err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash) {
	    	if (err) return next(err);
	    	user.password = hash;
	     	next();
	    });
  	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    	if (err) return cb(err);
    	cb(null, isMatch);
  	});
};
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.setPassword = function (password) {
	this.salt = bcrypt.genSaltSync(10);
	this.hash = bcrypt.hashSync(password, this.salt);
	
};

userSchema.methods.validPassword = function (password) {
	var hash = bcrypt.genSaltSync(10);
	return this.hash === hash;
};

mongoose.model('User', userSchema);