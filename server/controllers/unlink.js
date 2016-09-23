
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	config = require('../config/config');


module.exports.unlink = function (req, res) {
	var provider = req.body.provider;
	providers = ['facebook', 'google', 'linkedin','twitter'];
	if (providers.indexOf(provider) === -1) {
		return res.status(400).send({
			message: config.ERRORS.unknown_oauth_provider
		});
	}

	User.findById(req.body.id, function (err, user) {
		if (!user) {
			return res.status(400).send({
				message: config.ERRORS.user_not_found
			});
		}
		user[provider] = undefined;
		user.save(function () {
			res.status(200).end();
		});
	});
};