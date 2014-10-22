var Task = require('../models/task');
var handleError = require('./utils').handleError;

module.exports = {

    // get all tasks
    getAll: function(req, res) {
        var phaseId = req.params.id;

        Task.find({ phase: phaseId }, function (err, tasks) {
            if (err) return handleError(res, 500, err);
            if (tasks == undefined) return handleError(res,  404, 'Tasks not found');

            res.json({ tasks: tasks });
        });
    },

    // create new task
    create: function(req, res) {
        var phaseId = req.params.id;
        var description = req.body.description;
        var dueDate = req.body.dueDate;

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
        var completed = req.body.completed;

        // all of these fields are optional, only update the ones that are defined
        var updateFields = {};
        if (description) {
            updateFields.description = description;
        }

        if (dueDate) {
            updateFields.dueDate = dueDate;
        }

        if (completed) {
            updateFields.completed = completed == 'True' || completed == 'true';
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