// primary author: Olga
var userId = undefined;

Handlebars.registerPartial('tasks', Handlebars.templates['tasks']);

// set up: get the user and render their apps and tasks
$(document).ready(function() {
    $('#upper-right').append(Handlebars.templates['new-application-button']);

    // get logged in user
    $.get(
        '/user/'
    ).done(function(response) {
        userId = response.user._id;
        var userIsNew = response.userIsNew;

        // if the user is new, show a first time user help dialog
        if (userIsNew != undefined) {
            showHelp();
        }

        // render tasks and applications
        renderTaskList(true);
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

// render all of the (current) tasks of the applications
// optionally also render the applications (should only be done on startup)
function renderTaskList(renderApplications){
    // get all applications
    $.get(
        '/users/' + userId + '/applications'
    ).done(function(response) {
        var applications = response.applications;
        var pendingTasks = [];
        var completedTasks = [];

        var counter = 0;
        var len = applications.length;

        if(len == 0){
            addAllTasks([],[]);
        }

        applications.forEach(function(application) {

            // get all tasks
            $.get(
                '/applications/' + application._id + '/tasks'
            ).done(function(response) {
                if (renderApplications) {
                    // add the application and its tasks
                    var tasks = response.pendingTasks.concat(response.completedTasks);
                    application.tasks = sortByDueDate(tasks);

                    addApplication(application, application.currentPhase.phaseType); 
                }
                
                // add to the accumulating tasks
                pendingTasks = pendingTasks.concat(response.pendingTasks);
                completedTasks = completedTasks.concat(response.completedTasks);
                
                counter+=1;
                if(counter == len){
                    // sort tasks
                    pendingTasks = sortByDueDate(pendingTasks);
                    completedTasks = sortByDueDate(completedTasks);
                    // display tasks
                    addAllTasks(pendingTasks, completedTasks);
                }
            }).fail(function(error) {
                handleError(error);
            });
        });

    }).fail(function(error) {
        handleError(error);
    });

}


function showHelp() {
    var help = 'Click "Add Task" to add a new task, hit enter to submit. ' +
                'Double click an existing task to edit it, hit enter to submit. ' +
                'To delete a task, make its description empty.';
    showDialog(help);
}