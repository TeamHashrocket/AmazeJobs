var Application = require('../models/application');

module.exports = {

    // get all applications given a userId
    applications: function(req, res) {
        var owner = req.body.owner;

        Application.find({ owner:owner }, function (err, applications) {
            if (err) {
                // something bad happened
                console.error(err);
                res.redirect('/?error=Please try again');

            } else if (applications == null) {
                // user not found
                res.redirect('/?error=Application does not exist.');

            } else {
                // all good! send them back
                res.json({ applications:applications });
            }
        });
    },

    // create an application
    createApplication: function(req, res) {
        var owner = req.body.owner;
        var companyName = req.body.companyName;
            Application.create({ _id:userId, companyName:companyName, owner:owner, phases:[] }, function (err, application) {
                if (err) {
                    // oops
                    console.error(err)
                    res.json({applicationId:null})
                }

                res.json({applicationId:application._id});
            });
        });
    },

    // login existing Applications
    deleteApplication: function(req, res) {
        var applicationId = req.body.id;

        Application.findByIdAndRemove(applicationId, function (err, application) {
            if (err) {
                // something bad happened
                console.error(err);
                res.redirect('/?error=Please try again');
            }
        });
    }
}

}