function displayTasks(pendingTasks, completedTasks) {
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