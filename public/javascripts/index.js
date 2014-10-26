var userId = undefined;

$(document).ready(function() {
    $('#upper-right').append(Handlebars.templates['new-application-button']);

    // get logged in user
    $.get('/user/', function(response) {
        userId = response.user._id;

        // get all applications
        $.get('/user/' + userId + '/applications', function(response) {
            var applications = response.applications;
            var pendingTasks = [];
            var completedTasks = [];

            applications.forEach(function(application) {
                // get all tasks
                $.get('/application/' + application._id + '/tasks', function(response) {
                    var tasks = sortByDueDate(response.pendingTasks.concat(response.completedTasks));
                    pendingTasks = pendingTasks.concat(response.pendingTasks);
                    completedTasks = completedTasks.concat(response.completedTasks);

                    application.tasks = tasks;

                    addApplication(application);
                });
            });

            // sort tasks
            pendingTasks = sortByDueDate(pendingTasks);
            completedTasks = sortByDueDate(completedTasks);

            // display tasks
            addAllTasks(pendingTasks, completedTasks);
        });

    });

});

// logout
$(document).on('click', '#logout', function(){
    $.post('/logout/').done(function(response){
        location.replace('/');
    }).fail(function(error){
        console.log(error);
    });
});

function sortByDueDate(list) {
    return list.sort(function(a,b) {
        return a.dueDate - b.dueDate;
    })
}
