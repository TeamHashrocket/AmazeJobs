var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('../models/task');

var PhaseSchema = new Schema({
    phaseType: { type: String, enum: ['Applying', 'Interviewing', 'Offered', 'Terminated', 'Accepted'], required: true },
    startDate: { type: Date, required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    endDate: { type: Date }
});

PhaseSchema.methods.endPhase = function(terminated, callback) {
    // end current phase
    this.endDate = Date();

    var newPhase;
    var nextPhaseType = getNextPhase(this.phaseType);

    if (terminated) {
        // create a new terminated phase
        newPhase = new Phase({
            'phaseType':'Terminated',
            'startDate': new Date(),
            'application': this.application,
            'endDate': new Date()
        });

    } else if (nextPhaseType != 'Done') { // make sure we're not at a terminal phase
        // create a new phase
        var newPhase = new Phase({
            'phaseType': nextPhaseType,
            'startDate': new Date(),
            'application': this.application
        });

    } else {
        // we're in a terminal phase, return nothing
        return callback();
    }

    // save the new phase and return it
    newPhase.save(function(error, savedPhase){
        callback(error, savedPhase);
    });
}

// delete the phase and its associated tasks
PhaseSchema.pre('remove', function(next) {
    var phase = this;

    // delete all tasks associated with this phase
    Task.find({ phase: phase.id }).remove(function(err) {
        next(err);
    });
});


// determine the next phase type based on the current phase type
var getNextPhase = function(phaseType) {
    // Applying and Interviewing are non-terminal phases
    if (phaseType == 'Applying')
        return 'Interviewing';
    if (phaseType == 'Interviewing')
        return 'Offered';
    if (phaseType == 'Offered')
        return 'Accepted';

    // Accepted and Terminated are terminal phases
    return 'Done';
}

var Phase = mongoose.model('Phase', PhaseSchema);
module.exports = Phase;