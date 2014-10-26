var userId = undefined;

$(document).ready(function() {

    $(document).on('click', '#logout', function(){
        $.post('/logout/').done(function(response){
            location.replace('/');
        }).fail(function(error){
            console.log(error);
        });
    });
    // get logged in user
    $.get('/user/', function(response) {
        userId = response.user._id;

        // get all applications
        $.get('/user/' + userId + '/applications', function(response) {
            var applications = response.applications;

            // display applications
            addAllApplications(applications);

            // get all tasks
            $.get('/user/' + userId + '/tasks', function(response) {
                var pendingTasks = response.pendingTasks;
                var completedTasks = response.pendingTasks;

                // display tasks
                addAllTasks(pendingTasks, completedTasks);
            });
        });

    });

});