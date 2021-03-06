// primary author: Olga
var UserController = require('./userController');
var ApplicationController = require('./applicationController');
var PhaseController = require('./phaseController');
var TaskController = require('./taskController');
var TestController = require('./testController');

module.exports = function(app) {
    app.get('/' , function(req, res) {
        // already logged in, render apps page
        if (req.session.userId != undefined) {
            return res.render('index');

        } else {
            // not logged in, render login
            res.render('login');
        }
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
        Get the logged in user

        GET /user
        Request Body: empty
        Response:
            - user: the user
            - userIsNew: whether or not the user is new
            - error: error if there was one
    */
    app.get('/user', function(req, res) {
        UserController.getLoggedInUser(req, res);
    });

    /*  
        Get all of the applications associated with the user

        GET /users/{id}/applications
        Request Body: empty
        Response:
            - applications: list of Applications
            - error: error if there was one
    */
    app.get('/users/:id/applications', function(req, res) {
        ApplicationController.getAll(req, res);
    });

    /*  
        Get all of the tasks associated with the active phase, 
        separated into complete/incomplete

        GET /applications/{id}/tasks
        Request Body: empty
        Response:
            - completeTasks: list of complete Tasks
            - pendingTasks: list of pending Tasks
            - error: error if there was one
    */
    app.get('/applications/:id/tasks', function(req, res) {
        ApplicationController.getTasks(req, res);
    });

    /* 
        Creates a new application for a specified user
        
        POST /users/{id}/applications
        Request Body: 
            - companyName: company name
        Response:
            - application: new application
            - error: error if there was one
    */
    app.post('/users/:id/applications', function(req, res) {
        ApplicationController.create(req, res);
    });

    /* 
        Ends the current phase if any, creates a new phase if the 
        ended phase was not a terminal phase and the application 
        was not terminated by the user

        POST /applications/{id}/phases
        Request Body:
            - terminated: whether the application has been terminated or not (a boolean)
        Response:
            - phase: new phase if a new one has been created
            - error: error if there was one
    */
    app.post('/applications/:id/phases', function(req, res) {
        ApplicationController.changePhase(req, res);
    });


    /* 
        Deletes the specified application and its associated phases and tasks

        DELETE /applications/{id}
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.delete('/applications/:id', function(req, res) {
        ApplicationController.delete(req, res);
    });

    /* 
        Gets all phases for a specific application

        GET /applications/{id}/phases
        Request Body: empty
        Response:
            - phases: list of Phases
            - error: error if there was one
    */
    app.get('/applications/:id/phases', function(req, res) {
        PhaseController.getAll(req, res);
    });

    /* 
        Deletes the specified phase and its tasks

        DELETE /phases/{id}
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.delete('/phases/:id', function(req, res) {
        PhaseController.delete(req, res);
    });

    /* 
        Gets all the tasks associated with a specific phase
        
        GET /phases/{id}/tasks
        Request Body: empty
        Response:
            - tasks: list of Tasks
            - error: error if there was one
    */
    app.get('/phases/:id/tasks', function(req, res) {
        TaskController.getAll(req, res);
    });

    /* 
        Creates a new task for the specified phase

        POST /phases/{id}/tasks
        Request Body:
            - description: description
            - dueDate: due date
        Response:
            - task: new task
            - error: error if there was one
    */
    app.post('/phases/:id/tasks', function(req, res) {
        TaskController.create(req, res);
    });

    /* 
        Modifies the task's fields

        PUT /tasks/{id}
        Request Body:
            - description: description (optional)
            - dueDate: due date (optional)
            - completed: if task is completed, a boolean (optional)
        Response:
            - error: error if there was one
    */
    app.put('/tasks/:id', function(req, res) {
        TaskController.update(req, res);
    });

    /* 
        Deletes the specified task

        DELETE /tasks/{id}
        Request Body: empty
        Response:
            - error: error if there was one
    */
    app.delete('/tasks/:id', function(req, res) {
        TaskController.delete(req, res);
    });

}