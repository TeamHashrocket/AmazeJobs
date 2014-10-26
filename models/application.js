var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Phase = require('../models/phase');
var Task = require('../models/task');

var ApplicationSchema = new Schema({
    companyName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentPhase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }
});

ApplicationSchema.methods.changePhase = function(terminated, callback) {
    var application = this;
    var phaseId = application.currentPhase;

    // this is a new phase
    if (phaseId == undefined) {
        newPhase = new Phase({
            'phaseType':'Applying',
            'startDate': new Date(),
            'application': application.id
        });

        // save the new phase and return it
        newPhase.save(function(err, savedPhase) {
            if (err) return callback(err);

            // update currentPhase
            application.currentPhase = savedPhase.id;
            application.save(function(error) {
                if (error) return callback(error);
                callback(null, savedPhase);
            });
        });

    } else { // there is already a current phase

        // find the current phase
        Phase.findOne({ _id: phaseId }, function(err, phase) {
            if(err) return callback(err);

            // end the phase, make a new one if necessary
            phase.endPhase(terminated, function(error, newPhase) {
                if (error) return callback(error);

                // update currentPhase
                application.currentPhase = newPhaseId;
                application.save(function(error2) {
                    if (error2) return callback(error2);
                    callback(null, newPhase);
                });
            });
        });
    }
}

// get all complete and pending tasks of the current phase
ApplicationSchema.methods.getTasks = function(callback) {
    var application = this;
    // get complete tasks
    Task.find({ phase: application.currentPhase, completed: true }, function(err, completedTasks) {
        if (err) return callback(err);
        // get pending tasks
        Task.find({ phase: application.currentPhase, completed: false }, function(error, pendingTasks) {
            callback(error, { completedTasks:completedTasks, pendingTasks:pendingTasks });
        });
    });
}


// delete the application and its associated phases (which delete their tasks)
ApplicationSchema.pre('remove', function(next) {
    var application = this;

    // delete all phases associated with this application
    Phase.find({ application: application.id }).remove(function(err) {
        next(err);
    });
});

var Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;