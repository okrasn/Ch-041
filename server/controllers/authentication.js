var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var ERRORS = {
    fill_out_fields: 'Please fill out all fields',
    pass_not_match: 'Passwords not match',
    user_exist: 'That user already exists',
    invalid_data: 'Invalid email or password'
}

module.exports.register = function (req, res, next) {
    var alreadyExists = false;

    if (!req.body.email || !req.body.password || !req.body.repPassword) {
        return res.status(400).json({
            message: ERRORS.fill_out_fields
        });
    }
    if(req.body.password !== req.body.repPassword){
         return res.status(400).json({
            message: ERRORS.pass_not_match
        });
    }

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user) {
            return res.status(400).json({
                message: ERRORS.user_exist
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
    });
}

module.exports.login = function (req, res, next) {
    console.log(req.body.email + "is is logging to server");

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: ERRORS.fill_out_fields
        });
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (user) {
//            console.log("USER FOUND");
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
//            console.log("USER NOT FOUND");
            return res.status(401).json({
                message: ERRORS.invalid_data
            });
        }
    })(req, res, next);
}