// primary author: Elliott
function handleError(error) {
    console.log(error);
    showDialog('Something went wrong', 'error');
}

function removeDialog() {
    $('#dialog').html('');
}

function showDialog(text, type) {
	$('#dialog').html(Handlebars.templates['dialog']({
        text: text,
        type: type
    }));
}