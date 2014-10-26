var userId = document.cookie.userId;

$(document).ready(function() {
    console.log(getCookie('userId'));

    // get all applications
    $.get('/user/' + userId + '/applications', function(response) {
        var applications = response.content.applications;

        // display applications
        displayApplications(applications);

        // get all tasks
        $.get('/user/' + userId + '/tasks', function(response) {
            var pendingTasks = response.content.pendingTasks;
            var completedTasks = response.content.pendingTasks;

            // display tasks
            displayTasks(pendingTasks, completedTasks);
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

    function displayApplications(application) {
        var list = $('#application-list');
        list.after(Handlebars.templates['applications']({
            applications: applications
        }));
    }
});