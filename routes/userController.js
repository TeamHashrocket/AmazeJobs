var User = require('../models/user');

module.exports = {

    // login existing users
    login: function(req, res) {
        var email = req.body.email;

        // already logged in
        // if (req.session.userId != undefined) {
        //     return res.redirect('/feed');
        // }

        loginWithGoogle(email, function() {
            // find or create
            User.findOneAndUpdate({ email: email }, {}, { upsert: true }, function (err, user) {
                if (err) {
                console.error(err);
                res.status(500).send(err)
                } else {
                    res.json({ userId: user.id });
                }
            });
        });
    },

    // logout existing users
    logout: function(req, res) {
        // delete cookies
        req.session.destroy(function(err) {
            if (err) {
                console.error(err);
                res.status(500).send(err)
            } else {
                res.end();
            }
        });
    }
}

var loginWithGoogle = function(email, callback) {
    // what the fuck
    callback();
}