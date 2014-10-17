var Application = require('../models/application');

module.exports = {

    // get all applications given a userId
    getAll: function(req, res) {
        var owner = req.body.userId;

        Application.find({ owner:owner }, function (err, applications) {
            if (err) {
                // umm... something bad happened
                console.error(err);
                res.status(status).send(body)

            } else if (applications == null) {
                // user not found
                res.status(status).send(body)

            } else {
                // all good! send them back
                res.json({ applications:applications });
            }
        });
    },

    // create an application given an owner and a company name
    create: function(req, res) {
        var owner = req.body.userId;
        var companyName = req.body.companyName;
        var newApplication = new Application({
            companyName : companyName,
            owner       : owner,
            phases      : []
        });

        newApplication.save(function (err, application) {
            if (err) {
                // oops
                console.error(err)
                res.status(status).send(body)
            }

            // send an ID back because we are rockin this
            res.json({applicationId:application._id});
        });
    },

    // delete an application given an applicationId
    delete: function(req, res) {
        var applicationId = req.body.applicationId;

        Application.findByIdAndRemove(applicationId, function (err, application) {
            if (err) {
                // umm... something bad happened
                console.error(err);
                res.status(status).send(body)
            }
        });
    }
}