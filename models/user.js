var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Application = require('../models/application');
var Task = require('../models/task');

var UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});

// get all complete and pending tasks of the current phase
UserSchema.methods.getTasks = function(callback) {
    var user = this;

    // get all current Phase ids
    Application.find({ user: this.id }, 'currentPhase', function(err, applications) {
        if (err) return callback(err);
        var currentPhaseIds = applications.map(function(application) {
            return application.currentPhase;
        });

        // get complete tasks
        Task.find({ phase: { $in: currentPhaseIds }, complete: true }, function(error, completedTasks) {
            if (error) return callback(error);

            // get pending tasks
            Task.find({ phase: { $in: currentPhaseIds }, complete: false }, function(error2, pendingTasks) {
                callback(error2, { completedTasks:completedTasks, pendingTasks:pendingTasks });
            });
        });

    });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;