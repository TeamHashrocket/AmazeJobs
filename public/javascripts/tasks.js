// make new task input form
$(document).on('click', '#new-task-label', function(event) {
    event.preventDefault();
    $(this).replaceWith(Handlebars.templates['new-task-form']);
});

// make a new task
$(document).on('keydown', '#new-task-input', function(event) {
    // only care about enter being pressed
    if(event.which != 13) {
        return;
    }

    var thisForm = $(this);
    var list = thisForm.parent();
    var tasks = list.parent().parent();
    var phaseId = tasks.attr('phase-id');

    var description = $('[phase-id=' + phaseId + '] input[name=description]').val();
    var dueDate = $('[phase-id=' + phaseId + '] input[name=date]').val();

    $.post(
        '/phase/' + phaseId + '/tasks',
        { description:description, dueDate:dueDate }
    ).done(function(response) {
        addTask(response.task);

        // remove the input form, add a new New Task label to the end
        thisForm.remove();
        list.append(Handlebars.templates['new-task']);
    }).fail(function(error) {
        handleError(error);
    });
});

//edit task
$(document).on('submit', '.task', function(event) {
    event.preventDefault();

    var item = $(this).parent();
    var id = item.attr('task-id');

    var description = $('input[name=description]').val();
    var dueDate = $('input[name=date]').val();

    if (description) {
        $.post(
            '/task/' + id
        ).done(function(response) {
            // idk???
        }).fail(function(error) {
            handleError(error);
        });
    } else { // if empty description, delete it
        $.delete(
            '/task/' + id
        ).done(function(response) {
            item.remove();
        }).fail(function(error) {
            handleError(error);
        });
    }
});

Handlebars.registerPartial('task', Handlebars.templates['task']);

// add all tasks to the UI
function addAllTasks(pendingTasks, completedTasks) {
    var list = $('#task-list');
    if (pendingTasks.length != 0) {
        list.append(Handlebars.templates['tasks']({
            label: 'Pending Tasks',
            tasks: pendingTasks
        }));
    }

    if (completedTasks.length != 0) {
        list.append(Handlebars.templates['tasks']({
            label: 'Completed Tasks',
            tasks: completedTasks
        }));
    }
    $('.ui.checkbox').checkbox();
}

// add all tasks to the UI
function addAppTasks(tasks, phaseId) { 
    var list = $('[phase-id=' + phaseId + ']');
        list.append(Handlebars.templates['tasks']({
            label: 'Tasks',
            tasks: tasks
    }));
    
    $('.ui.checkbox').checkbox();
}

// add a single task to both the app task list and the total task list
function addTask(task) {
    var appTaskList = $('[phase-id=' + task.phase + '] .list');
    var allTasksList = $('#task-list .list');
    var taskItem = Handlebars.templates['task']({
        _id: task._id,
        completed: task.completed,
        description: task.description,
        dueDate: task.dueDate
    });

    appTaskList.append(taskItem);
    allTasksList.append(taskItem);

    $('.ui.checkbox').checkbox();
}

// given a list of tasks, sort them by due date
function sortByDueDate(list) {
    return list.sort(function(a,b) {
        return a.dueDate - b.dueDate;
    });
}