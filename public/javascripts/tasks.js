// handlebars for loop
Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});
//toggle complete/incomplete
$(document).on('mouseup', ':checkbox', function(event){
    var id = $(this).attr('name');
    var checked = $(this).is(':checked');
    
    $.ajax({
        url         : '/task/'+id,
        type        : 'PUT',
        data        : {completed:!checked},
        dataType    : 'json',
        success     : handleCheckedCallback(id, checked)
    });
});
function handleCheckedCallback(id, checked){
    return function(error){
        $('[name='+id+']').prop('checked', !checked);
        renderTaskList();
    }
}
// make new task input form
$(document).on('click', '#new-task-label', function(event) {
    event.preventDefault();
    $(this).replaceWith(Handlebars.templates['new-task-form']({
        month: 'MM',
        day: 'DD',
        year: 'YYYY'
    }));
    $('.ui.dropdown').dropdown();
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

// edit task
$(document).on('dblclick', '.task-checkbox', function(event) {
    var task = $(this);
    var id = $(this).parent().parent().attr('task-id');

    task.replaceWith(Handlebars.templates['new-task-form']({
        taskId: id,
        description: task.find('.description').val(),
        dueDate: task.find('.dueDate').val(),
        month: task.find('.dueDate').val(),
        day: 'DD',
        year: 'YYYY'
    }));

    var item = $(this).parent();
    var id = item.attr('task-id');

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
    list.empty();
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