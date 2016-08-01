var mongoose = require('mongoose');

var feedSchema = new mongoose.Schema({
    title: String,
    link: String,
    category: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }]
});

mongoose.model('Feed', feedSchema);