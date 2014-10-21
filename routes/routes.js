var UserController = require('./userController');
var ApplicationController = require('./applicationController');
var PhaseController = require('./phaseController');
var TaskController = require('./taskController');
var TestController = require('./testController');

module.exports = function(app) {
    // Testing
    app.get('/test' , function(req, res) {
        TestController.test(res);
    });

    // User
    app.get('/login', function(req, res) {
    /* 
        Logs in the user via Google, adds them to the database
        if they don't exist, sets cookies

        GET /login
        Request Body: empty
        Response:
            - redirects to a google login page
            - error: error if there was one
    */
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
        GET /oauthcallback
        Request Body:
            - Oauth2callback from google
        Response:
            - renders a homepage
            - error: error if there was one
    */
    app.get('/oauthcallback', function(req, res){
        UserController.oauthcallback(req, res);
    });

    /*  
        Get all of the applications associated with the user

        GET /applications
        Request Body:
            - user id
        Response:
            - applications: list of Applications
            - error: error if there was one
    */
    app.get('/applications', function(req, res) {
        ApplicationController.getAll(req, res);
    });

    /* 
        Creates a new application for a specified user
        
        POST /applications
        Request Body: 
            - userId: user id
            - companyName: company name
        Response:
            - applicationId: new application id
            - error: error if there was one
    */
    app.post('/applications', function(req, res) {
        ApplicationController.create(req, res);
    });

    /* 
        Ends the current phase if any, creates a new phase if the 
        ended phase was not a terminal phase and the application 
        was not terminated by the user

        PUT /application/{id}
        Request Body:
            - whether the application has been terminated or not (a boolean)
        Response:
            - phaseId: new phase id if a new one has been created
            - error: error if there was one
    */
    app.put('/application/:id', function(req, res) {
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

        GET /phases
        Request Body: 
            - application id
        Response:
            - phases: list of Phases
            - error: error if there was one
    */
    app.get('/phases', function(req, res) {
        PhaseController.getAll(req, res);
    });

    /* 
        Creates a new phase in the given application

        POST /phases
        Request Body:
            - application id
            - phase type
        Response:
            - phaseId: new phase id
            - error: error if there was one
    */
    app.post('/phases', function(req, res) {
        PhaseController.create(req, res);
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
        
        GET /tasks
        Request Body:
            - phase id
        Response:
            - tasks: list of Tasks
            - error: error if there was one
    */
    app.get('/tasks', function(req, res) {
        TaskController.get(req, res);
    });

    /* 
        Creates a new task for the specified phase

        POST /tasks
        Request Body:
            - phase id
            - description
            - due date (optional)
        Response:
            - taskId: new task id
            - error: error if there was one
    */
    app.post('/tasks', function(req, res) {
        TaskController.create(req, res);
    });

    /* 
        Modifies the task. If due date is given, populates a 
        calendar event and shares it with the user

        PUT /task/{id}
        Request Body:
            - description (optional)
            - due date (optional)
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