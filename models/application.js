var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
    companyName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }]
});

var Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;