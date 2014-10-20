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

    app.get('/oauthcallback', function(req, res){
        UserController.oauthcallback(req.query.code);
    });

    // Application
    app.get('/applications', function(req, res) {
        ApplicationController.getAll(req, res);
    });

    app.post('/applications', function(req, res) {
        ApplicationController.create(req, res);
    });

    app.delete('/application/:id', function(req, res) {
        ApplicationController.delete(req, res);
    });

    // Application Phase
    app.get('/phases', function(req, res) {
        PhaseController.getAll(req, res);
    });

    app.post('/phases', function(req, res) {
        PhaseController.create(req, res);
    });

    app.put('/phase/:id', function(req, res) {
        PhaseController.update(req, res);
    });

    app.delete('/phase/:id', function(req, res) {
        PhaseController.delete(req, res);
    });

    // Application Task
    app.get('/tasks', function(req, res) {
        TaskController.get(req, res);
    });

    app.post('/tasks', function(req, res) {
        TaskController.create(req, res);
    });

    app.put('/task/:id', function(req, res) {
        TaskController.update(req, res);
    });

    app.delete('/task/:id', function(req, res) {
        TaskController.delete(req, res);
    });

    
}