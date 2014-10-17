var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhaseSchema = new Schema({
    phaseType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

var Phase = mongoose.model('Phase', PhaseSchema);
module.exports = Phase;