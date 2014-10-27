var userId = undefined;

Handlebars.registerPartial('tasks', Handlebars.templates['tasks']);

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
            var counter = 0;
            var len = applications.length;
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
                    
                    counter+=1;
                    if(counter == len){
                        // sort tasks
                        pendingTasks = sortByDueDate(pendingTasks);
                        completedTasks = sortByDueDate(completedTasks);
                        // display tasks

                        addAllTasks(pendingTasks, completedTasks,'#task-list');
                    }
                }).fail(function(error) {
                    handleError(error);
                });
            });

        }).fail(function(error) {
            handleError(error);
        });

    }).fail(function(error) {
        handleError(error);
    });
});

// logout
$(document).on('click', '#logout', function(){
    $.post(
        '/logout/'
    ).done(function(response){
        location.replace('/');
    }).fail(function(error){
        handleError(error);
    });
});

function renderTaskList(){
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
            var counter = 0;
            var len = applications.length;
            applications.forEach(function(application) {
                // get all tasks
                $.get(
                    '/application/' + application._id + '/tasks'
                ).done(function(response) {
                    // add the application and its tasks
                    var tasks = response.pendingTasks.concat(response.completedTasks);
                    application.tasks = sortByDueDate(tasks);
                    
                    // add to the accumulating tasks
                    pendingTasks = pendingTasks.concat(response.pendingTasks);
                    completedTasks = completedTasks.concat(response.completedTasks);
                    
                    counter+=1;
                    if(counter == len){
                        // sort tasks
                        pendingTasks = sortByDueDate(pendingTasks);
                        completedTasks = sortByDueDate(completedTasks);
                        // display tasks

                        addAllTasks(pendingTasks, completedTasks,'#task-list');
                    }
                }).fail(function(error) {
                    handleError(error);
                });
            });

        }).fail(function(error) {
            handleError(error);
        });

    }).fail(function(error) {
        handleError(error);
    });
}
