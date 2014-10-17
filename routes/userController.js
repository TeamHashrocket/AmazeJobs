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
            User.findOne({ email: email }, 'id', { upsert: true }, function (err, user) {
                if (err) console.error(err);
                return err, user.id;
            });
        });
    },

    // logout existing users
    logout: function(req, res) {
        // delete cookies
        req.session.destroy(function(err) {
            if (err) console.error(err);
        });
    }
}

var loginWithGoogle = function(email, callback) {
    // what the fuck
    callback();
}

}