// primary author: Olga
// insert input field for new application
$(document).on('click', '#new-application-button', function(event) {
    $(this).replaceWith(Handlebars.templates['new-application']);
    $('input[name=companyName]').focus();

});

// make a new application
$(document).on('keydown', '#new-application-input', function(event) {
    // only care about enter being pressed
    if(event.which != 13) {
        return;
    }

    event.preventDefault();
    var companyName = $('input[name=companyName]').val();

    if (companyName == '') {
        return showError('Please enter a company name');
    }

    // put the new application button back
    $(this).replaceWith(Handlebars.templates['new-application-button']);
    
    $.post(
        '/users/' + userId + '/applications',
        { companyName: companyName } 
    ).done(function(response) {
        // set up starting phase type
        var phaseId = response.application.currentPhase;
        response.application.currentPhase = { _id: phaseId, phaseType: 'Applying' };
        response.application.tasks =[];
        addApplication(response.application, response.application.currentPhase.phaseType);
    }).fail(function(error) {
        handleError(error);
    });
});

// delete an application
$(document).on('click', '#delete-application', function(event) {
    var item = $(this).parent();
    var id = item.attr('app-id');

    $.ajax({
        type: 'DELETE',
        url: '/applications/' + id
    }).done(function(response) {
        var application = $('[app-id=' + id + ']');
        application.remove();
        renderTaskList(false);
    }).fail(function(error) {
        handleError(error);
    });
});

Handlebars.registerPartial('application', Handlebars.templates['application']);
Handlebars.registerPartial('new-task', Handlebars.templates['new-task']);
// add an application to the UI
function addApplication(application, terminated) {
    var list = $('#application-list');
    list.prepend(Handlebars.templates['application']({
        application: application,
        terminated : terminated
    }));

    addAppTasks(application.tasks, application.currentPhase._id);
    updatePhaseLabels(application.currentPhase.phaseType, application._id);
    
    $('.ui.accordion').accordion();
}