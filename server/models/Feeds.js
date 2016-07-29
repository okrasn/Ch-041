var mongoose = require('mongoose');

var feedSchema = new mongoose.Schema({
    title: String,
    link: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Feed', feedSchema);