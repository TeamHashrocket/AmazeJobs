var userId = undefined;

$(document).ready(function() {
    // get logged in user
    $.get('/user/', function(response) {
        userId = response.user._id;

        // get all applications
        $.get('/user/' + userId + '/applications', function(response) {
            var applications = response.applications;

            // display applications
            displayApplications(applications);

            // get all tasks
            $.get('/user/' + userId + '/tasks', function(response) {
                var pendingTasks = response.pendingTasks;
                var completedTasks = response.pendingTasks;

                // display tasks
                displayTasks(pendingTasks, completedTasks);
            });
        });

    });

    function displayTasks(pendingTasks, completedTasks) {
        var list = $('#task-list');
        if (pendingTasks.length() != 0) {
            list.after(Handlebars.templates['tasks']({
                label: 'Pending Tasks',
                tasks: pendingTasks
            }));
        }

        if (completedTasks.length() != 0) {
            list.after(Handlebars.templates['tasks']({
                label: 'Completed Tasks',
                tasks: completedTasks
            }));
        }
    }

    function displayApplications(applications) {
        var list = $('#application-list');
        console.log(list);
        list.after(Handlebars.templates['applications']({
            applications: applications
        }));
    }

});