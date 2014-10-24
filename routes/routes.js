var UserController = require('./userController');
var ApplicationController = require('./applicationController');
var PhaseController = require('./phaseController');
var TaskController = require('./taskController');
var TestController = require('./testController');

module.exports = function(app) {
    app.get('/' , function(req, res) {
        res.render('index');
    });
    
    // Runs testing suite
    app.get('/test' , function(req, res) {
        TestController.test(res);
    });

    /* 
        Logs in the user via Google OAuth2.0 by redirecting to 
        Google. Once Google has received login/permssions, 
        redirects to /oauthcallback.

        GET /login
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.get('/login', function(req, res) {
        UserController.login(req, res);
    });

    /*  
        Logs out the user, destroys cookies

        POST /logout
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.post('/logout', function(req, res) {
        UserController.logout(req, res);
    });

    /* 
        Gets tokens from using the authorization code 
        and saves them as the client tokens. Adds user to 
        database if they don’t exist, sets cookies.

        GET /oauthcallback
        Request Body:
            - Oauth2callback from Google
        Response:
            - error: error if there was one
    */
    app.get('/oauthcallback', function(req, res){
        UserController.oauthcallback(req, res);
    });

    /*  
        Get all of the applications associated with the user

        GET /applications
        Request Body: empty
        Response:
            - applications: list of Applications
            - error: error if there was one
    */
    app.get('/user/:id/applications', function(req, res) {
        ApplicationController.getAll(req, res);
    });

    /* 
        Creates a new application for a specified user
        
        POST /applications
        Request Body: 
            - companyName: company name
        Response:
            - applicationId: new application id
            - error: error if there was one
    */
    app.post('/user/:id/applications', function(req, res) {
        ApplicationController.create(req, res);
    });

    /* 
        Ends the current phase if any, creates a new phase if the 
        ended phase was not a terminal phase and the application 
        was not terminated by the user

        POST /application/{id}/phases
        Request Body:
            - terminated: whether the application has been terminated or not (a boolean)
        Response:
            - phaseId: new phase id if a new one has been created
            - error: error if there was one
    */
    app.post('/application/:id/phases', function(req, res) {
        ApplicationController.changePhase(req, res);
    });


    /* 
        Deletes the specified application and its associated phases and tasks

        DELETE /application/{id}
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.delete('/application/:id', function(req, res) {
        ApplicationController.delete(req, res);
    });

    /* 
        Gets all phases for a specific application

        GET /application/{id}/phases
        Request Body: empty
        Response:
            - phases: list of Phases
            - error: error if there was one
    */
    app.get('/application/:id/phases', function(req, res) {
        PhaseController.getAll(req, res);
    });

    /* 
        Deletes the specified phase and its tasks

        DELETE /phase/{id}
        Request Body:
            - phase id
        Response:
            - error: error if there was one
    */
    app.delete('/phase/:id', function(req, res) {
        PhaseController.delete(req, res);
    });

    /* 
        Gets all the tasks associated with a specific phase
        
        GET /phase/{id}/tasks
        Request Body:
            - phase id
        Response:
            - tasks: list of Tasks
            - error: error if there was one
    */
    app.get('/phase/:id/tasks', function(req, res) {
        TaskController.getAll(req, res);
    });

    /* 
        Creates a new task for the specified phase

        POST /phase/{id}/tasks
        Request Body:
            - description: description
            - dueDate: due date (optional)
        Response:
            - taskId: new task id
            - error: error if there was one
    */
    app.post('/phase/:id/tasks', function(req, res) {
        TaskController.create(req, res);
    });

    /* 
        Modifies the task's fields

        PUT /task/{id}
        Request Body:
            - description: description (optional)
            - dueDate: due date (optional)
            - completed: if task is completed, a boolean (optional)
        Response:
            - error: error if there was one
    */
    app.put('/task/:id', function(req, res) {
        TaskController.update(req, res);
    });

    /* 
        Deletes the specified task

        DELETE /task/{id}
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.delete('/task/:id', function(req, res) {
        TaskController.delete(req, res);
    });

}