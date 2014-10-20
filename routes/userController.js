var User = require('../models/user');
var google = require('googleapis');
var calendar = google.calendar('v3');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('563808076610-qk1rp29poub2fpnmdm26tf5n16cd81pl.apps.googleusercontent.com', 's9co0tkklFmv9d2Va47sSXV1', 'http://amazejobs-hashrocket.rhcloud.com/oauthcallback');
module.exports = {

    // login existing users
    login: function(req, res) {
        //Probably won't need this, can just read email from google given the permissions
        var email = req.body.email;


        //Can retain our own session so user can login/out of our app without logging in/out of google
        // already logged in
        // if (req.session.userId != undefined) {
        //     return res.redirect('/feed');
        // }

        loginWithGoogle(email, function() {
            // generate a url that asks permissions for Google Calendar and Email address scopes
            var scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/calendar'];
            var url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: scopes // If you only need one scope you can pass it as string
            });
            //console.log(url);
            res.redirect(url);
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

    //oauthcallback function
    oauthcallback:function(code){
        oauth2Client.getToken(code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
            if(!err) {
                oauth2Client.setCredentials(tokens);
                //user is now logged in
                //would read in and insert user to db now, and set up session here.
            }
        });
    }
}

var loginWithGoogle = function(email, callback) {
    // find or create
    User.findOneAndUpdate({ email: email }, {}, { upsert: true }, function (err, user) {
        if (err) {
            console.error(err);
            res.status(500).send(err)
        } else {
            res.json({ userId: user.id });
        }
    });
    callback();
}