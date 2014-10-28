// primary author: Catherine
var User = require('../models/user');
var google = require('googleapis');
var calendar = google.calendar('v3');
var plus = google.plus('v1');
var handleError = require('./utils').handleError;
var OAuth2 = google.auth.OAuth2;
// openshift
var oauth2Client = new OAuth2('563808076610-qk1rp29poub2fpnmdm26tf5n16cd81pl.apps.googleusercontent.com', 's9co0tkklFmv9d2Va47sSXV1', 'http://amazejobs-hashrocket.rhcloud.com/oauthcallback');

//localhost testing
//var oauth2Client = new OAuth2('563808076610-op9dep6ss37gq68d9tv0sg2igper3pl6.apps.googleusercontent.com', 'YzyYv8U3OBVymmCXSr2Ojh0h', 'http://localhost:8080/oauthcallback');

module.exports = {

    // login existing users
    login: function(req, res) {
        loginWithGoogle(res);
    },

    // logout existing users
    logout: function(req, res) {
        // delete cookies
        req.session.destroy(function(err) {
            if (err) handleError(res, 500, err);
            res.json({success:true});
        });
    },

    //oauthcallback function
    oauthcallback:function(req, res) {
        var code = req.query.code;
        oauth2Client.getToken(code, function(err, tokens) {

            // Now tokens contains an access_token and an optional refresh_token. Save them.
            if (err) return handleError(res, 500, err);
            oauth2Client.setCredentials(tokens);

            // user is now logged in. Using token to get personal info
            plus.people.get({userId:'me', auth:oauth2Client}, function(err, googlePlusInfo) {
                if (err) return handleError(res, 500, err);
                savePersonalInfo(googlePlusInfo, req, res);
            });
            
        });
    },

    // get all tasks of the active phases of the applications of the user
    getLoggedInUser: function(req, res) {
        var user = req.session.userId

        // save if the user is new and reset it
        var userIsNew = req.session.userIsNew;
        req.session.userIsNew = undefined;
        req.session.save();

        User.findOne({ _id: user }, function (err, user) {
            if (err) return handleError(res, 500, err);
            if (user == undefined) return handleError(res, 404, 'User not found');
            res.json({ user: user, userIsNew: userIsNew });
        });
    }
}

// sends user to google login url
var loginWithGoogle = function(res) {
    // generate a url that asks permissions for Google Calendar and Email address scopes
    var scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.me'];
    var url = oauth2Client.generateAuthUrl({
        access_type : 'offline', // 'online' (default) or 'offline' (gets refresh_token)
        scope       : scopes // If you only need one scope you can pass it as string
    });

    res.redirect(url);
}

// parses and saves the google plus info into the Users model
var savePersonalInfo = function(googlePlusInfo, req, res) {
    var name = googlePlusInfo.name.givenName; // + " " + googlePlusInfo.name.familyName;
    var email = null;

    // finds the email associated with the account
    for (var i = 0; i < googlePlusInfo.emails.length; i++) {
        var emailObject = googlePlusInfo.emails[i];
        if (emailObject.type == 'account') {
            email = emailObject.value;
        }
    }

    // try to find the user
    User.findOne({ email:email }, function (err, user) {
        if (err) return handleError(res, 500, err);

        // create a new user and save the fact that they're new to the session
        if (user == undefined) {
            var newUser = new User({ name: name, email: email });
        
            newUser.save(function (err, user) {
                if (err) return handleError(res, 500, err);
                userObject = user;
                req.session.userIsNew = true;
                req.session.userId = userObject.id;
                req.session.save();
                res.redirect('/');
            });

        } else {
            req.session.userId = user.id;
            req.session.save();
            res.redirect('/');
        }
    });
}