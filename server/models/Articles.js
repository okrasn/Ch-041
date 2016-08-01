var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: String,
    link: String,
    content: String,
    date: Date,
    feed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed'
    }
});

mongoose.model('Article', articleSchema);