var mongoose = require('mongoose');

var feedSchema = new mongoose.Schema({
	title: String,
	description: String,
	link: String,
	rsslink: String,
	//category: String,
	format: {
		type: String,
		enum: ["RSS", "ATOM"],
		required: true
	}, // format can be eather RSS or ATOM
});

mongoose.model('Feed', feedSchema);