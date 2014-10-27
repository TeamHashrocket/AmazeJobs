// primary author: Elliott
function handleError(error) {
    console.log(error);
    showDialog('Something went wrong');
}

function removeDialog() {
    $('#dialog').html('');
}

function showDialog(text) {
    $('#dialog').html(Handlebars.templates['dialog']({
        text: text
    }));
}