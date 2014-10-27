// handlebars for loop
Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});
//toggle complete/incomplete
$(document).on('click', '.checkbox', function(event){
    var id = $(this).attr('name');
    console.log(id);
    //$.post().done().fail();
});
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

// make a new task or submit an edit
$(document).on('keydown', '#new-task-input', function(event) {
    // only care about enter being pressed
    if(event.which != 13) {
        return;
    }

    var thisForm = $(this);
    var list = thisForm.parent();
    var tasks = list.parent().parent();
    var phaseId = tasks.attr('phase-id');

    var id = thisForm.attr('task-id');
    var description = thisForm.find('#description').val();
    var month = thisForm.find('#month .text').html();
    var day = thisForm.find('#day .text').html();
    var year = thisForm.find('#year .text').html();
    var date;

    if (month != 'MM' && day != 'DD' && year == 'YYYY') {
        date = new Date(year, month, day);
    }

    // existing task
    if (id) {
        if (description) {
            // this is an edit
            editTask(id, description, date, function(task) {
                thisForm.replaceWith(Handlebars.templates['task']({
                    _id: task._id,
                    completed: task.completed,
                    description: task.description,
                    dueDate: task.dueDate
                }));
            });
        } else {
            // this is a delete
            deleteTask(id, function() {
                thisForm.remove();
            });
        }
    } else {
        // this is a new task post
        newTask(phaseId, description, date, function(task) {
            addTask(task);

            // remove the input form, add a new New Task label to the end
            thisForm.remove();
            list.append(Handlebars.templates['new-task']);
        });
    }
});

// edit task
$(document).on('dblclick', '.task-item', function(event) {
    var task = $(this);
    var id = $(this).attr('task-id');
    var description = task.find('.description').html();
    var month = task.find('#month').html();
    var day = task.find('#day').html();
    var year = task.find('#year').html();

    if (month == undefined) {
        month = 'MM';
        day = 'DD';
        year = 'YYYY';
    }

    task.replaceWith(Handlebars.templates['new-task-form']({
        id: id,
        description: description,
        month: month,
        day: day,
        year: year
    }));

    $('.ui.dropdown').dropdown();
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

function newTask(phaseId, description, date, callback) {
    $.post(
        '/phase/' + phaseId + '/tasks',
        { description:description, dueDate:date }
    ).done(function(response) {
        callback(response.task);
    }).fail(function(error) {
        handleError(error);
    });
}

function editTask(id, description, date, callback) {
    $.ajax({
        type: 'PUT',
        url:'/task/' + id,
        data: { description:description, dueDate:date }
    }).done(function(response) {
        callback(response.task);
    }).fail(function(error) {
        handleError(error);
    });
}

function deleteTask(id, callback) {
    $.ajax({
        type: 'DELETE',
        url:'/task/' + id
    }).done(function(response) {
        callback();
    }).fail(function(error) {
        handleError(error);
    });
}

// given a list of tasks, sort them by due date
function sortByDueDate(list) {
    return list.sort(function(a,b) {
        return a.dueDate - b.dueDate;
    });
}