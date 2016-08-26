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
		displayName: String,
		picture : String,
		facebook: String,
		google: String,
		hash: String,
		salt: String,
		avatar: {
			type: String,
			default: ""
		},
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
		if (!user.isModified('password')) {
			return next();
		}
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(password, done) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		done(err, isMatch);
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