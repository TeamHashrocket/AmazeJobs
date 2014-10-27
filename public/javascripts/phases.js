// primary author: Elliott
// phase change button
$(document).on('click', '.change-phase', function(event) {
    phaseChange(false, this);
});

// terminate application button
$(document).on('click', '.terminate-application', function(event) {
    phaseChange(true, this);
});

// change the phase, update the UI
var phaseChange = function(terminated, that) {
    var appId = $(that).parent().parent().attr('app-id');

    $.post(
        '/applications/' + appId + '/phases',
        { terminated: terminated } 

    ).done(function(response) {
        var phase = response.phase;

        updatePhaseLabels(phase.phaseType, appId);
        clearTasks(phase._id, appId);
        $('.title[app-id ='+appId+']').removeClass("Applying Interviewing Offered Terminated Accepted");
        $('.title[app-id ='+appId+']').addClass(phase.phaseType);
    }).fail(function(error) {
        handleError(error);
    });
}

const phaseLabels = ['Applying', 'Interviewing', 'Offered'];
const phaseButtonLabels = ['Got Inteview', 'Got Offer', 'Accepted Offer'];
const terminalLabels = ['Accepted', 'Terminated'];

var updatePhaseLabels = function(phaseType, appId) {
    var terminal = terminalLabels.indexOf(phaseType) > -1;
    var phaseText = $('.title[app-id='+appId+'] .phase');
    var changePhaseButton = $('.content[app-id='+appId+'] .change-phase');
    // update the current phase text
    phaseText.html(phaseType);

    // if the phase is terminal, there should be no change phase buttons
    if (terminal) {
        var terminateButton = $('.content[app-id='+appId+'] .terminate-application');
        changePhaseButton.remove();
        terminateButton.remove();
    } else {
        // change the phase change button label accordingly
        var phaseIndex = phaseLabels.indexOf(phaseType);
        changePhaseButton.html(phaseButtonLabels[phaseIndex]);
    }
}