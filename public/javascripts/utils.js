// primary author: Elliott
function handleError(error) {
    console.log(error);
    $('#error').html(Handlebars.templates['error']({
        error: 'Something went wrong'
    }));
}

function removeError() {
    $('#error').html('');
}

function showError(error) {
    $('#error').html(Handlebars.templates['error']({
        error: error
    }));
}