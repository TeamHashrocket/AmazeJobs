var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhaseSchema = new Schema({
    phaseType: { type: String, enum: ['Applying', 'Interviewing', 'Offered', 'Terminated'], required: true },
    startDate: { type: Date, required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    endDate: { type: Date }
});

// determine the next phase type based on the current phase type
PhaseSchema.statics.nextPhase = function(phaseType) {
    // Applying and Interviewing are non-terminal phases
    if (phaseType == 'Applying')
        return 'Interviewing';
    if (phaseType == 'Interviewing')
        return 'Offered';

    // Offered and Terminated are terminal phases
    return 'Done';
}

var Phase = mongoose.model('Phase', PhaseSchema);
module.exports = Phase;