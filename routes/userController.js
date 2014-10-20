var User = require('../models/user');
var google = require('googleapis');
var calendar = google.calendar('v3');
var OAuth2 = google.auth.OAuth2;
module.exports = {

    // login existing users
    login: function(req, res) {
        var email = req.body.email;

        // already logged in
        // if (req.session.userId != undefined) {
        //     return res.redirect('/feed');
        // }

        loginWithGoogle(email, function() {
            var oauth2Client = new OAuth2('563808076610-qk1rp29poub2fpnmdm26tf5n16cd81pl.apps.googleusercontent.com', 's9co0tkklFmv9d2Va47sSXV1', 'http://amazejobs-hashrocket.rhcloud.com/oauthcallback');
            //'https://amazejobs-hashrocket.rhcloud.com/oauthWindow.html');
            // generate a url that asks permissions for Google Calendar scopes
            var scopes = ['https://www.googleapis.com/auth/calendar'];
            var url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: scopes // If you only need one scope you can pass it as string
            });
            //console.log(url);
            res.redirect(url);

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