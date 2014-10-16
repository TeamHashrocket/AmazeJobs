var User = require('../models/user');

module.exports = {

    // login existing users
    login: function(req, res) {
        var email = req.body.email;
        var password = req.body.password;

        User.findOne({ email: email }, function (err, user) {
            if (err) {
                // something bad happened
                console.error(err);
                res.redirect('/?error=Please try again');

            } else if (user == null) {
                // user not found
                res.redirect('/?error=Please make an account');

            } else {
                // all good! verify password
                verifyPassword(password, user, req, res);
            }
        });
    }
}

}