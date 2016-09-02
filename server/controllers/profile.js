var multer = require('multer'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './client/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });

var upload = multer({ //multer settings
    storage: storage
}).single('file');

/** API path that will upload the files */
module.exports.upload = function (req, res) {
    upload(req, res, function (err) {
        var fileName = req.file.filename;
        User.findById(req.body.user, function (err, user) {
            if (err) {
                return next(err);
            }
            user.avatar = "uploads/" + fileName;
            user.save(function (err, user) {
                res.json({ error_code: 0, err_desc: null });
            });
        });
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
    })
};
