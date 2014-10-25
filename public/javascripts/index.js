var userId = document.cookie.userId;

$(document).ready(function() {
    console.log(getCookie('userId'));
    var completedTasks = [];
    var pendingTasks = [];
    // get all applications
    $.get('/user/' + userId + '/applications', function(response) {
        var applications = response.content.applications;

        // for each app, post it on the page and get its tasks
        applications.forEach(function(application) {
            // post on page
            displayApplication(application);

            // get tasks
            $.get('/application/' + application.id + '/tasks', function(response) {
                completedTasks.concat(response.content.completedTasks);
                pendingTasks.concat(response.content.pendingTasks);
            });
        });

        // now display tasks
        displayTasks(pendingTasks, completedTasks);
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

    function displayApplication(application) {
        var list = $('#application-list');
        list.after(Handlebars.templates['application']({
            application: application
        }));
    }
});