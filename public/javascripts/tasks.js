// primary author: Catherine
function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

// handlebars for loop
Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper("getMonth", function(datestring) {
    if (datestring) {
        var date = new Date(datestring);
        return date.getMonth();  
    }

    return new Date().getMonth() +1;
});

Handlebars.registerHelper("getDay", function(datestring) {
    if (datestring) {
        var date = new Date(datestring);
        return date.getDate();  
    }
    
    return new Date().getDate();
});

Handlebars.registerHelper("getYear", function(datestring) {
    if (datestring) {
        var date = new Date(datestring);
        return date.getFullYear();  
    }
    
    return new Date().getFullYear();
});

//toggle complete/incomplete
$(document).on('mouseup', ':checkbox', function(event){
    var id = $(this).attr('name');
    var checked = $(this).is(':checked');
    
    $.ajax({
        url         : '/tasks/'+id,
        type        : 'PUT',
        data        : {completed:!checked},
        dataType    : 'json',
        success     : handleCheckedCallback(id, checked)
    });
});

function handleCheckedCallback(id, checked){
    return function(error){
        $('[name='+id+']').prop('checked', !checked);
        renderTaskList(false);
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
    $('.new-task-input input[type="text"]').keyup(resizeInput).each(resizeInput).focus();
});

// make a new task or submit an edit
$(document).on('keydown', '.new-task-input', function(event) {
    // only care about enter being pressed
    if(event.which != 13) {
        return;
    }

    var thisForm = $(this);
    var list = thisForm.parent();
    var tasks = list.parent().parent();
    var phaseId = tasks.attr('phase-id') || thisForm.attr('phase-id');

    var id = thisForm.attr('task-id');
    var completed = thisForm.find('[type="checkbox"]').attr('checked');
    var description = thisForm.find('#description').val();
    var month = thisForm.find('#month .text').html();
    var day = thisForm.find('#day .text').html();
    var year = thisForm.find('#year .text').html();
    

    if (month == 'MM' || day == 'DD' || year == 'YYYY') {
        return showDialog('Please enter a date', 'error');
    }

    var date = new Date(year, parseInt(month), day);

    // existing task
    if (id && description) {
        // this is an edit
        editTask(id, description, date, function(task) {
            thisForm.replaceWith(Handlebars.templates['task']({
                _id: id,
                phase: phaseId,
                completed: completed,
                description: description,
                dueDate: date
            }));

            var taskItem = $('[task-id=' + id + ']');
            taskItem.find('.description').html(description);
            taskItem.find('.month').html(month);
            taskItem.find('.day').html(day);
            taskItem.find('.year').html(year);
        });
    } else if (id) {
        // this is a delete
        deleteTask(id, function() {
            thisForm.remove();
            $('[task-id=' + id + ']').remove();
            deleteTaskListIfEmpty();
        });
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
$(document).on('dblclick', '.task-item .task-content', function(event) {
    var task = $(this).parent();
    var id = task.attr('task-id');
    var phaseId = task.attr('phase-id');
    var description = task.find('.description').html();
    var month = task.find('.month').html();
    var day = task.find('.day').html();
    var year = task.find('.year').html();
    var date = new Date(year, month, day);

    task.replaceWith(Handlebars.templates['new-task-form']({
        id: id,
        phaseId: phaseId,
        description: description,
        dueDate: date
    }));

    $('.ui.dropdown').dropdown();
    $('.new-task-input input[type="text"]').keyup(resizeInput).each(resizeInput);
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
    var list = $('.tasks[phase-id=' + phaseId + ']');
        list.append(Handlebars.templates['tasks']({
            label: 'Tasks',
            tasks: tasks
    }));
    
    $('.ui.checkbox').checkbox();

    // add a new add task label
    $('[phase-id=' + phaseId + '] .list').append(Handlebars.templates['new-task']);
}

// add a single task to both the app task list and the total task list
function addTask(task) {
    var appTaskList = $('[phase-id=' + task.phase + '] .list');
    var allTasksList = $('.tasks-Pending .list');
    var taskItem ={
        _id: task._id,
        phase: task.phase,
        completed: task.completed,
        description: task.description,
        dueDate: task.dueDate
    };

    // if no tasks in pending list, create the pending list
    if(allTasksList.children().length==0) {
        var list = $('#task-list');
        list.prepend(Handlebars.templates['tasks']({
            label: 'Pending Tasks',
            tasks: [taskItem]
        }));  
    } else {
        allTasksList.append(Handlebars.templates['task'](taskItem));
    }

    appTaskList.append(Handlebars.templates['task'](taskItem));
    $('.ui.checkbox').checkbox();
}

function newTask(phaseId, description, date, callback) {
    $.post(
        '/phases/' + phaseId + '/tasks',
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
        url:'/tasks/' + id,
        data: { description:description, dueDate:date }
    }).done(function() {
        callback();
    }).fail(function(error) {
        handleError(error);
    });
}

function deleteTask(id, callback) {
    $.ajax({
        type: 'DELETE',
        url:'/tasks/' + id
    }).done(function(response) {
        callback();
    }).fail(function(error) {
        handleError(error);
    });
}

function clearTasks(phaseId, appId) {
    var tasks = $('[app-id=' + appId + '] .tasks');
    var oldPhaseId = tasks.attr('phase-id');
    tasks.attr('phase-id', phaseId)

    // remove old tasks
    $('.task-item[phase-id=' + oldPhaseId + ']').remove();
    deleteTaskListIfEmpty();
}

// delete the task lists if they are empty
function deleteTaskListIfEmpty() {
    var pendingTaskList = $('.tasks-Pending .list');
    var completedTaskList = $('.tasks-Completed .list');

    if (pendingTaskList.children().length == 0) {
        pendingTaskList.parent().remove();
    }

    if (completedTaskList.children().length == 0) {
        completedTaskList.parent().remove();
    }
}

// given a list of tasks, sort them by due date
function sortByDueDate(list) {
    return list.sort(function(a,b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
}
