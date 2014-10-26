var userId = undefined;

$(document).ready(function() {
    $('#upper-right').append(Handlebars.templates['new-application-button']);

    // get logged in user
    $.get(
        '/user/'
    ).done(function(response) {
        userId = response.user._id;

        // get all applications
        $.get(
            '/user/' + userId + '/applications'
        ).done(function(response) {
            var applications = response.applications;
            var pendingTasks = [];
            var completedTasks = [];

            applications.forEach(function(application) {
                // get all tasks
                $.get(
                    '/application/' + application._id + '/tasks'
                ).done(function(response) {
                    // add the application and its tasks
                    var tasks = response.pendingTasks.concat(response.completedTasks);
                    application.tasks = sortByDueDate(tasks);
                    addApplication(application);

                    // add to the accumulating tasks
                    pendingTasks = pendingTasks.concat(response.pendingTasks);
                    completedTasks = completedTasks.concat(response.completedTasks);

                }).fail(function(error) {
                    console.log(error);
                });
            });

            // sort tasks
            pendingTasks = sortByDueDate(pendingTasks);
            completedTasks = sortByDueDate(completedTasks);
            // display tasks
            addAllTasks(pendingTasks, completedTasks);

        }).fail(function(error) {
            console.log(error);
        });

    }).fail(function(error) {
        console.log(error);
    });
});

// logout
$(document).on('click', '#logout', function(){
    $.post(
        '/logout/'
    ).done(function(response){
        location.replace('/');
    }).fail(function(error){
        console.log(error);
    });
});
