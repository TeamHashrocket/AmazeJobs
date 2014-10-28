// primary author: Elliott
function handleError(error) {
    console.log(error);
    showDialog('Something went wrong');
}

function removeDialog() {
    $('#dialog').html('');
}

function showDialog(text) {
    
    if(text == 'Click "Add Task" to add a new task, hit enter to submit. ' +
                'Double click an existing task to edit it, hit enter to submit. ' +
                'To delete a task, make its description empty.'){
		//if it's the initial help text, make the dialog yellow, otherwise make it red
		$('#dialog').html(Handlebars.templates['dialog']({
	        text: text,
	        help:'Help'
	    }));
	}else{
		$('#dialog').html(Handlebars.templates['dialog']({
        	text: text,
        	help: ''
    	}));
	}

}