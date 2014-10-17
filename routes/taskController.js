var Task = require('../models/task');

module.exports = {

    // get all tasks
    getAll: function(req, res) {
        var phaseId = req.body.phaseId;

        Task.find({ phase: phaseId }, function (err, tasks) {
            if (err) {
                console.error(err);
                res.send(500, err);
            } else {
                res.json({ tasks: tasks });
            }
        });
    },

    // create new task
    create: function(req, res) {
        var phaseId = req.body.phaseId;
        var description = req.body.description;
        var dueDate = req.body.dueDate;

        var task = new Task({ phase: phaseId, description: description, dueDate: dueDate });
        task.save(function (err, newTask) {
            if (err) {
                console.error(err);
                res.send(500, err);
            } else {
                res.json({ taskId: newTask.id });
            }
        });
    },

    // modify existing task
    update: function(req, res) {
        var taskId = req.body.taskId;
        var description = req.body.description;
        var dueDate = req.body.dueDate;

        Task.update({ _id: taskId }, { description: description, dueDate: dueDate }, function (err) {
            if (err) {
                console.error(err);
                res.send(500, err);
            } else {
                res.end();
            }
        });
    },

    // delete task
    delete: function(req, res) {
        var taskId = req.body.taskId;

        Task.findByIdAndRemove(taskId, function (err) {
            if (err) {
                console.error(err);
                res.send(500, err);
            } else {
                res.end();
            }
        });
    }
}