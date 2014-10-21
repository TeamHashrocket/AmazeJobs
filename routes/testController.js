var User = require('../models/user');
var handleError = require('./utils').handleError;

module.exports = {
    test: function(res) {
        User.findOne({email:"hashr0ck3t@gmail.com"}, function(err, user) {
            if (err) handleError(res, 500, err);
            var userId = user._id;
            res.render('tests', {userId:userId});
        });
    }
}