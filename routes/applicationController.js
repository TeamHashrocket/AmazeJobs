var Application = require('../models/application');
var Phase = require('../models/phase');
var handleError = require('./utils').handleError;

module.exports = {

    // get all applications given a userId
    getAll: function(req, res) {
        var user = req.params.id;

        Application.find({ user:user }, function (err, applications) {
            if (err) return handleError(res, 500, err);
            if (applications == null) return handleError(res, 404, 'Cannot find applications for the user');

            // all good! send them back
            res.json({ applications:applications });
        });
    },

    // create an application given an owner and a company name
    create: function(req, res) {
        var user = req.params.id;
        var companyName = req.body.companyName;
        var newApplication = new Application({
            companyName : companyName,
            user        : user
        });

        newApplication.save(function (err, application) {
            if (err) return handleError(res, 500, err);
            res.json({ applicationId:application._id });
        });
    },

    // end current phase and start a new one if ended phase is not
    // terminal and user has not terminated the application
    changePhase: function(req, res) {
        var applicationId = req.params.id;
        var terminated = req.body.terminated == 'True' || req.body.terminated == 'true';

        Application.findOne({ _id: applicationId }, function(err, application) {
            if (err) return handleError(res,  500, err);
            if (application == null) return handleError(res,  404, 'Application not found');

            application.changePhase(terminated, function(error, newPhaseId) {
                if(error) return handleError(res, 500, err);
                res.json({ phaseId: newPhaseId });
            });
        });
    },

    // delete an application given an applicationId
    delete: function(req, res) {
        var applicationId = req.params.id;

        if (applicationId === undefined) return handleError(res, 404, 'No application found with null id');

        Application.findByIdAndRemove(applicationId, function (err, application) {
            if (err) return handleError(res, 500, err);
            res.json({ success:true });
        });
    }
}