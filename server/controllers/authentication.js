var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }
    var user = new User();
    user.email = req.body.email;

    user.setPassword(req.body.password)

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token": token
        });
    });
}

module.exports.login = function (req, res, next) {
    console.log(req.body.email + "is is logging to server");

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (user) {
            console.log("USER FOUND");
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            console.log("USER NOT FOUND");
            return res.status(401).json({message: 'Invalid email or password!'});
        }
    })(req, res, next);
}