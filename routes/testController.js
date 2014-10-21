var User = require('../models/user');

module.exports = {
    test:function(res) {
        User.findOne({email:"hashr0ck3t@gmail.com"}, function(err, user) {
            if (err) {
                res.status(500).send(err);
            } else {
                var userId = user._id;
                res.render('tests', {userId:userId});
            }
        });
    }
}