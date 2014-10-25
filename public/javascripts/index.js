var userId = req.session.userId;

$(document).ready(function() {
    // get all applications
    $.get('/user/' + userId + '/applications', function(response) {
        var applications = response.content.applications;
    });
});