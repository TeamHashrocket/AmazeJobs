var Task = require('../models/task');
var handleError = require('./utils').handleError;

module.exports = {

    // get all tasks
    getAll: function(req, res) {
        var phaseId = req.params.id;

        Task.find({ phase: phaseId }, function (err, tasks) {
            if (err) return handleError(res, 500, err);
            res.json({ tasks: tasks });
        });
    },

    // create new task
    create: function(req, res) {
        var phaseId = req.params.id;
        var description = req.body.description;
        var dueDate = req.body.dueDate;

        if (description === undefined || description == "") {
            description = " ";
        }

        var task = new Task({ phase: phaseId, description: description, dueDate: dueDate });
        
        task.save(function (err, newTask) {
            if (err) return handleError(res, 500, err);
            res.json({ taskId: newTask.id });
        });
    },

    // modify existing task
    update: function(req, res) {
        var taskId = req.params.id;
        var description = req.body.description;
        var dueDate = req.body.dueDate;

        var updateFields = { description: description };
        
        if (dueDate){
            updateFields = { description: description, dueDate: dueDate };
        }
        
        Task.update({ _id: taskId }, updateFields, function (err) {
            if (err) return handleError(res, 500, err);
            res.json({ success:true });
        });
    },

    // delete task
    delete: function(req, res) {
        var taskId = req.params.id;

        Task.findByIdAndRemove(taskId, function (err) {
            if (err) return handleError(res, 500, err);
            res.json({ success:true });
        });
    }
}