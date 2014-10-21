var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Phase = require('../models/phase');

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

        // save the new phase and return its id
        newPhase.save(function(err, savedPhase) {
            if (err) return callback(err);

            // update currentPhase
            application.currentPhase = savedPhase.id;
            application.save(function(error, savedPhase) {
                if (error) return callback(error);
                callback(null, savedPhase.id);
            });
        });

    } else { // there is already a current phase

        // find the current phase
        Phase.findOne({ _id: phaseId }, function(err, phase) {
            if(err) return callback(err);

            // end the phase, make a new one if necessary
            phase.endPhase(terminated, function(error, newPhaseId) {
                if (error) return callback(error);

                // update currentPhase
                application.currentPhase = newPhaseId;
                application.save(function(error2, savedPhase) {
                    if (error2) return callback(error2);
                    callback(null, newPhaseId);
                });
            });
        });
    }
}

var Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;