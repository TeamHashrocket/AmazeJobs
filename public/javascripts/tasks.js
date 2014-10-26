$(document).on('submit', '#new-task', function(event) {
    event.preventDefault();

    var item = $(this).parent();
    var id = item.attr('task-id');

    var description = $("input[name=description]").val();
    var dueDate = $("input[name=date]").val();

    $.post(
        '/phase/' + id + '/tasks',
        { description:description, dueDate:dueDate }
    ).done(function(response) {
        addApplication(response.application);
    }).fail(function(error) {
        console.log(error);
    });
});

$(document).on('submit', '.task', function(event) {
    event.preventDefault();

    var item = $(this).parent();
    var id = item.attr('task-id');

    var description = $("input[name=description]").val();
    var dueDate = $("input[name=date]").val();

    if (description) {
        $.post({
            '/task/' + id
        ).done(function(response) {
            // idk???
        }).fail(function(error) {
            console.log(error);
        });
    } else { // if empty description, delete it
        $.delete({
            '/task/' + id
        ).done(function(response) {
            item.remove();
        }).fail(function(error) {
            console.log(error);
        });
    }
});

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
}