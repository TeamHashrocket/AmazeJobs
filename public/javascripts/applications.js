$(document).on('click', '#new-application', function(event) {
    $(this).replaceWith(Handlebars.templates['new-application']);
});

$(document).on('keydown', '#new-application-input', function(event) {
    // only care about enter being pressed
    if(event.which != 13) {
        return;
    }

    event.preventDefault();

    var companyName = $("input[name=companyName]").val();

    $(this).replaceWith(Handlebars.templates['new-application-button']);
    $.post(
        '/user/' + userId + '/applications',
        { companyName: companyName } 
    ).done(function(response) {
        addApplication(response.application);
    }).fail(function(error) {
        console.log(error);
    });
});

$(document).on('click', '#delete-application', function(event) {
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