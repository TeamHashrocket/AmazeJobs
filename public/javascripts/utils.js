function handleError(error) {
    console.log(error);
    $('#error').html(Handlebars.templates['error']({
        error: 'Something went wrong'
    }));
}

function showError(error) {
    $('#error').html(Handlebars.templates['error']({
        error: error
    }));
}