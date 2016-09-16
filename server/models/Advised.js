var mongoose = require('mongoose');

var advicedSchema = new mongoose.Schema({
    articlesDictionary: [{
        category: String, articles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }]
    }],
    feedsDictionary: [{
        category: String, feeds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feed'
        }]
    }]
});

mongoose.model('Advice', advicedSchema);