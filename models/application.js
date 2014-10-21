var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
    companyName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentPhase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }
});

ApplicationSchema.methods.changePhase = function(terminated, callback) {
    var phaseId = this.currentPhase;

    // this is a new phase
    if (phaseId == undefined) {
        newPhase = new Phase({
            'phaseType':'Applied',
            'startDate': new Date(),
            'application': this.id
        });

        // save the new phase and return its id
        newPhase.save(function(error, savedPhase) {
            if error return callback(error);

            this.currentPhase = savedPhase.id;
            callback(null, savedPhase.id);
        });

    } else {

        // find the current phase
        Phase.findOne({ _id: phaseId }, function(err, phase) {
            if(err) return callback(err);

            phase.endPhase(terminated, function(error, newPhaseId) {
                if error return callback(error);

                this.currentPhase = newPhaseId;
                callback(null, newPhaseId);
            });
        });
    }
}

var Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;