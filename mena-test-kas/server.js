var express         = require('express');
var path            = require('path');
var config          = require('./libs/config');
var log             = require('./libs/log')(module);
var ArticleModel    = require('./libs/mongoose').ArticleModel;
var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/api/feeds', function(req, res) {
    return FeedMode.find(function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/api/feeds', function(req, res) {
    var feed = new FeedMode({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        urgency: req.body.urgency,
        images: req.body.images
    });

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});