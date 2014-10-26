$(document).on('click', '#new-application', function(event) {
    event.preventDefault();
    $.post(
        '/user/' + userId + '/applications'
    ).done(function(response) {
        addApplication(response.application);
    }).fail(function(error) {
        console.log(error);
    });
});

$(document).on('click', '#delete-application', function(event) {
    event.preventDefault();

    var item = $(this).parent();
    var id = item.attr('app-id');

    $.delete(
        '/application/' + id
    ).done(function(response) {
        item.remove();
    }).fail(function(error) {
        console.log(error);
    });
});

function addApplication(application) {
    var list = $('#application-list');
    list.prepend(Handlebars.templates['application']({
        application: application
    }));
}

function addAllApplications(applications) {
    var list = $('#application-list');
    list.append(Handlebars.templates['applications']({
        applications: applications
    }));
}