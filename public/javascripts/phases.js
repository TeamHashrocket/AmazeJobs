// phase change button
$(document).on('click', '#change-phase', function(event) {
    phaseChange(false, this);
});

// terminate application button
$(document).on('click', '#terminate-application', function(event) {
    phaseChange(true, this);
});

// change the phase, update the UI
var phaseChange = function(terminated, that) {
    var appId = $(that).parent().parent().attr('app-id');

    $.post(
        '/application/' + appId + '/phases',
        { terminated: terminated } 

    ).done(function(response) {
        var phase = response.phase;

        if (phase != null) {
            updatePhaseLabels(phase.phaseType, appId);
        }

    }).fail(function(error) {
        handleError(error);
    });
}

const phaseLabels = ['Interviewing', 'Offered'];
const phaseButtonLabels = ['Got Offer', 'Accepted Offer'];
const terminalLabels = ['Accepted', 'Terminated'];

var updatePhaseLabels = function(phaseType, appId) {
    var terminal = terminalLabels.indexOf(phaseType) > -1;
    console.log(phaseType, terminal);
    var phaseText = $('[phase-identifier='+appId+']');
    var changePhaseButton = $('#change-phase');
    console.log(changePhaseButton);

    // update the current phase text
    phaseText.html(phaseType);

    // if the phase is terminal, there should be no change phase buttons
    if (terminal) {
        var terminateButton = $('#terminate-application');
        changePhaseButton.remove();
        terminateButton.remove();
    } else {
        // change the phase change button label accordingly
        var phaseIndex = phaseLabels.indexOf(phaseType);
        changePhaseButton.html(phaseButtonLabels[phaseIndex]);
    }
}