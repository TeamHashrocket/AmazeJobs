// primary author: Olga
var Application = require('../models/application');
var Phase = require('../models/phase');
var handleError = require('./utils').handleError;

module.exports = {

    // get all applications given a userId
    getAll: function(req, res) {
        var user = req.params.id;

        Application.find({ user:user }).exec(function (err, applications) {
            Application.populate(applications, { path: "currentPhase" }, function (err, applications) {
                if (err) return handleError(res, 500, err);
                if (applications == undefined) return handleError(res, 404, 'Applications not found');

                // all good! send them back
                res.json({ applications:applications });
            });
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

            // make a new phase as soon as we get an application going
            application.changePhase(false, function(error) {
                if (error) return handleError(res, 500, error);
                res.json({ application:application });
            })
        });
    },

    // get all tasks of the active phase
    getTasks: function(req, res) {
        var application = req.params.id;

        Application.findOne({ _id: application }, function (err, application) {
            if (err) return handleError(res, 500, err);
            if (application == undefined) return handleError(res, 404, 'Application not found');

            application.getTasks(function (err, tasks) {
                if (err) return handleError(res, 500, err);
                if (tasks == undefined) return handleError(res, 404, 'Tasks not found');

                // tasks is {completeTasks:completeTasks, pendingTasks:pendingTasks}
                res.json(tasks);
            });
        });
    },

    // end current phase and start a new one if ended phase is not
    // terminal and user has not terminated the application
    changePhase: function(req, res) {
        var applicationId = req.params.id;
        var terminated = req.body.terminated == 'True' || req.body.terminated == 'true';

        Application.findOne({ _id: applicationId }, function(err, application) {
            if (err) return handleError(res,  500, err);
            if (application == undefined) return handleError(res,  404, 'Application not found');

            application.changePhase(terminated, function(error, newPhase) {
                if(error) return handleError(res, 500, err);
                res.json({ phase: newPhase });
            });
        });
    },

    // delete an application given an applicationId
    delete: function(req, res) {
        var applicationId = req.params.id;

        Application.findOne({ _id: applicationId }, function (err, application) {
            if (err) return handleError(res, 500, err);
            if (application == undefined) return handleError(res, 404, "Application not found");

            // remove, not findByIdAndRemove because we have middleware
            application.remove(function(error) {
                if (err) return handleError(res, 500, err);
                res.json({ success:true });
            });
        });
    }
}