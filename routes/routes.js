var UserController = require('./userController');
var ApplicationController = require('./applicationController');
var PhaseController = require('./phaseController');
var TaskController = require('./taskController');

module.exports = function(app) {
    // User
    app.post('/login', function(req, res) {
        UserController.login(req, res);
    });

    app.post('/logout', function(req, res) {
        UserController.logout(req, res);
    });

    // Application
    app.get('/applications', function(req, res) {
        ApplicationController.applications(req, res);
    });

    app.post('/applications', function(req, res) {
        ApplicationController.createApplication(req, res);
    });

    app.delete('/application/:id', function(req, res) {
        ApplicationController.deleteApplication(req, res);
    });

    // Application Phase
    app.get('/phases', function(req, res) {
        
    });

    app.post('/phases', function(req, res) {
        
    });

    app.put('/phase/:id', function(req, res) {
        
    });

    app.delete('/phase/:id', function(req, res) {
        
    });

    // Application Task
    app.get('/tasks', function(req, res) {
        
    });

    app.post('/tasks', function(req, res) {
        
    });

    app.put('/task/:id', function(req, res) {
        
    });

    app.delete('/task/:id', function(req, res) {
        
    });

    
}