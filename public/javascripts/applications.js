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
    var companyName = $('input[name=companyName]').val();

    if (companyName == '') {
        return showError('Please enter a company name');
    }

    // put the new application button back
    $(this).replaceWith(Handlebars.templates['new-application-button']);
    
    $.post(
        '/user/' + userId + '/applications',
        { companyName: companyName } 
    ).done(function(response) {
        // set up starting phase type
        var phaseId = response.application.currentPhase;
        response.application.currentPhase = { _id: phaseId, phaseType: 'Applying' };
        response.application.tasks = {label:'Tasks', tasks:[]};
        
        addApplication(response.application);
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
        url: '/application/' + id
    }).done(function(response) {
        var application = $('[app-id=' + id + ']');
        application.remove();
    }).fail(function(error) {
        handleError(error);
    });
});

Handlebars.registerPartial('application', Handlebars.templates['application']);
Handlebars.registerPartial('new-task', Handlebars.templates['new-task']);

// add an application to the UI
function addApplication(application) {
    var list = $('#application-list');
    list.prepend(Handlebars.templates['application']({
        application: application
    }));

    addAppTasks(application.tasks, application.currentPhase._id);
    updatePhaseLabels(application.currentPhase.phaseType, application._id);

    // add a new add task label
    $('[phase-id=' + application.currentPhase._id + '] .list').append(Handlebars.templates['new-task']);
    
    $('.ui.accordion').accordion();
}