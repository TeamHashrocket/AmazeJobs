// insert input field for new application
$(document).on('click', '#new-application-button', function(event) {
    $(this).replaceWith(Handlebars.templates['new-application']);
});

// make a new application
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
        // set up starting phase type
        response.application.currentPhase = { phaseType: 'Applying' };
        addApplication(response.application);
    }).fail(function(error) {
        console.log(error);
    });
});

// delete an application
$(document).on('click', '#delete-application', function(event) {
    var item = $(this).parent();
    var id = item.attr('app-id');

    $.ajax({
        type: 'DELETE',
        url: '/application/' + id
    }).done(function(response) {
        var application = $('[app-id=' + id + ']');
        application.remove();
    }).fail(function(error) {
        console.log(error);
    });
});

Handlebars.registerPartial('application', Handlebars.templates['application']);

function addApplication(application) {
    var list = $('#application-list');
    list.prepend(Handlebars.templates['application']({
        application: application
    }));

    $('.ui.accordion').accordion();
}