var Application = require('../models/application');

module.exports = {

    // get all applications given a userId
    applications: function(req, res) {
        var owner = req.body.owner;

        Application.find({ owner:owner }, function (err, applications) {
            if (err) {
                // something bad happened
                console.error(err);
                res.send(500, err);

            } else if (applications == null) {
                // user not found
                res.send(500, err);

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
        var newApplication = new Application({
            _id         : userId,
            companyName : companyName,
            owner       : owner,
            phases      : []
        });

        newApplication.save(function (err, application) {
            if (err) {
                // oops
                console.error(err)
                res.send(500, err);
            }

            res.json({applicationId:application._id});
        });
    },

    // login existing Applications
    deleteApplication: function(req, res) {
        var applicationId = req.body.id;

        Application.findByIdAndRemove(applicationId, function (err, application) {
            if (err) {
                // something bad happened
                console.error(err);
                res.send(500, err);
            }
        });
    }
}

}