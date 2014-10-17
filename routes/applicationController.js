var Application = require('../models/application');

module.exports = {

    // get all applications given a userId
    getAll: function(req, res) {
        var owner = req.query.userId;

        Application.find({ owner:owner }, function (err, applications) {
            if (err) {
                // umm... something bad happened
                console.error(err);
                res.status(500).send(err);

            } else if (applications == null) {
                // user not found
                res.status(500).send(err);

            } else {
                // all good! send them back
                res.json({ applications:applications });
            }
        });
    },

    // create an application given an owner and a company name
    create: function(req, res) {
        var owner = req.query.userId;
        var companyName = req.query.companyName;
        var newApplication = new Application({
            companyName : companyName,
            owner       : owner,
            phases      : []
        });

        newApplication.save(function (err, application) {
            if (err) {
                // oops
                console.error(err)
                res.status(500).send(err);
            }

            // send an ID back because we are rockin this
            res.json({applicationId:application._id});
        });
    },

    // delete an application given an applicationId
    delete: function(req, res) {
        var applicationId = req.query.applicationId;

        Application.findByIdAndRemove(applicationId, function (err, application) {
            if (err) {
                // umm... something bad happened
                console.error(err);
                res.status(500).send(err);
            }
        });
    }
}