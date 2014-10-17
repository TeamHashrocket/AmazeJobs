var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    description: { type: String, required: true },
    dueDate: { type: Date },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;