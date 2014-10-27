var userId = $("#qunit").attr("userId");

function ajax (params, url, restType, testName, success) {
    if (restType != "DELETE" && restType != "PUT" && restType != "POST") {
        restType = "GET";
    }

    $.ajax({
        url         : url,
        type        : restType,
        data        : params,
        dataType    : 'json',
        beforeSend  : function() {},
        error       : function() {ok(false, testName); start()},
        success     : function(data) {ok(true, testName); success(data);}
    });
}

function createApplication(callback) {
    ajax({ companyName:"YOLOsoft" }, "/user/"+userId+"/applications", "POST", "Create Application", callback);
}

function deleteApplication(applicationId, callback) {
    ajax({}, "/applications/" + applicationId, "DELETE", "Delete Application", callback);
}

function getApplications(callback) {
    ajax({}, "/users/"+userId+"/applications", "GET", "Get Applications", callback);
}

function getPhases(applicationId, callback) {
    ajax({}, "/applications/"+applicationId+"/phases", "GET", "Get Phases", callback);
}

function changePhase(applicationId, terminated, callback) {
    ajax({terminated:terminated}, "/applications/"+applicationId+"/phases", "POST", terminated ? "Terminate Phase" : "Change Phase", callback)
}

function createTask(phaseId, description, date, callback) {
    ajax({description:description, dueDate:date}, "/phases/"+phaseId+"/tasks", "POST", "Created Task", callback);
}

function deleteTask(taskId, callback) {
    ajax({}, "/tasks/"+taskId, "DELETE", "Delete Task", callback);
}

function editTask(taskId, description, date, completed, callback) {
    ajax({description:description, dueDate:date, completed:completed}, "/tasks/"+taskId, "PUT", "Edited task", callback);
}

function getTasks(phaseId, callback) {
    ajax({}, "/phases/"+phaseId+"/tasks", "GET", "Get Tasks", callback);
}

// =====================================================================================
// Tests require a user with the email hashr0ck3t@gmail.com to exist on the server first
// cannot automate google login
// =====================================================================================

// adds two apps, removes two apps and counts in between
asyncTest("Create & Delete applications", function() {
    expect(13);

    getApplications(function(data) {
        var initialNumApps = data.applications.length;
 
        createApplication(function(data) {
            var applicationId1 = data.applicationId;

            getApplications(function(data) {
                var newNumApps = data.applications.length;
                equal(newNumApps - 1, initialNumApps, "Count After Adding App");

                createApplication(function(data) {
                    var applicationId2 = data.applicationId;

                    getApplications(function(data) {
                        newNumApps = data.applications.length;
                        equal(newNumApps - 2, initialNumApps, "Count After Adding Another App");

                        deleteApplication(applicationId1, function(data) {

                            getApplications(function(data) {
                                newNumApps = data.applications.length;
                                equal(newNumApps - 1, initialNumApps, "Count After Deleting App");

                                deleteApplication(applicationId2, function(data) {

                                    getApplications(function(data) {
                                        newNumApps = data.applications.length;
                                        equal(newNumApps, initialNumApps, "Count After Deleting Another App");
                                        start();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// goes through all phases except terminated also checks that you cant
// go past offered without terminating
asyncTest("Go Through All Phases", function() {
    expect(15);
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                changePhase(applicationId, false, function(data) {
                    phaseId = data.phaseId;

                    getPhases(applicationId, function(data) {
                        for (var i=0; i<data.phases.length; i++) {
                            phase = data.phases[i];
                            if (phaseId == phase._id) {
                                break;
                            }
                        }
                        equal(phase.phaseType, "Interviewing", "Checking Phase");

                        changePhase(applicationId, false, function(data) {
                            phaseId = data.phaseId;

                            getPhases(applicationId, function(data) {
                                for (var i=0; i<data.phases.length; i++) {
                                    phase = data.phases[i];
                                    if (phaseId == phase._id) {
                                        break;
                                    }
                                }
                                equal(phase.phaseType, "Offered", "Checking Phase");
                                phaseId = data.phaseId;

                                changePhase(applicationId, false, function(data) {
                                phaseId = data.phaseId;

                                getPhases(applicationId, function(data) {
                                    for (var i=0; i<data.phases.length; i++) {
                                        phase = data.phases[i];
                                        if (phaseId == phase._id) {
                                            break;
                                        }
                                    }
                                    equal(phase.phaseType, "Accepted", "Checking Phase");
                                    phaseId = data.phaseId;

                                    changePhase(applicationId, false, function(data) {
                                        phaseId = data.phaseId;
                                        equal(phaseId, undefined, "Does not go past Accepted");

                                        start();
                                    });
                                });
                            });
                            });
                        });
                    });
                });
            });
        });
    });
});

// goes through all phases except terminated
asyncTest("Terminate at All Phases", function() {
    expect(30);
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                changePhase(applicationId, true, function(data) {
                    phaseId = data.phaseId;

                    getPhases(applicationId, function(data) {
                        for (var i=0; i<data.phases.length; i++) {
                            phase = data.phases[i];
                            if (phaseId == phase._id) {
                                break;
                            }
                        }
                        equal(phase.phaseType, "Terminated", "Checking Termination");

                    });
                });
            });
        });
    });
    
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                changePhase(applicationId, false, function(data) {
                    phaseId = data.phaseId;

                    getPhases(applicationId, function(data) {
                        for (var i=0; i<data.phases.length; i++) {
                            phase = data.phases[i];
                            if (phaseId == phase._id) {
                                break;
                            }
                        }
                        equal(phase.phaseType, "Interviewing", "Checking Phase");

                        changePhase(applicationId, true, function(data) {
                            phaseId = data.phaseId;

                            getPhases(applicationId, function(data) {
                                for (var i=0; i<data.phases.length; i++) {
                                    phase = data.phases[i];
                                    if (phaseId == phase._id) {
                                        break;
                                    }
                                }
                                equal(phase.phaseType, "Terminated", "Checking Termination");
                            });
                        });
                    });
                });
            });
        });
    });

    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                changePhase(applicationId, false, function(data) {
                    phaseId = data.phaseId;

                    getPhases(applicationId, function(data) {
                        for (var i=0; i<data.phases.length; i++) {
                            phase = data.phases[i];
                            if (phaseId == phase._id) {
                                break;
                            }
                        }
                        equal(phase.phaseType, "Interviewing", "Checking Phase");

                        changePhase(applicationId, false, function(data) {
                            phaseId = data.phaseId;

                            getPhases(applicationId, function(data) {
                                for (var i=0; i<data.phases.length; i++) {
                                    phase = data.phases[i];
                                    if (phaseId == phase._id) {
                                        break;
                                    }
                                }
                                equal(phase.phaseType, "Offered", "Checking Phase");

                                changePhase(applicationId, true, function(data) {
                                    phaseId = data.phaseId;

                                    getPhases(applicationId, function(data) {
                                        for (var i=0; i<data.phases.length; i++) {
                                            phase = data.phases[i];
                                            if (phaseId == phase._id) {
                                                break;
                                            }
                                        }
                                        equal(phase.phaseType, "Terminated", "Checking Termination");

                                        start();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// create two applications, and check that changing one phase does not affect the other
asyncTest("Phase Changes Don't Affect Other Applications", function() {
    expect(13);
    createApplication(function(data) {
        var applicationId1 = data.applicationId;

        createApplication(function(data) {
            var applicationId2 = data.applicationId;

            changePhase(applicationId1, false, function(data) {
                var phaseId1 = data.phaseId;

                getPhases(applicationId1, function(data) {
                    for (var i=0; i<data.phases.length; i++) {
                        phase = data.phases[i];
                        if (phaseId1 == phase._id) {
                            break;
                        }
                    }
                    equal(phase.phaseType, "Applying", "Checking Phase 1");

                    changePhase(applicationId2, false, function(data) {
                        var phaseId2 = data.phaseId;

                        getPhases(applicationId1, function(data) {
                            for (var i=0; i<data.phases.length; i++) {
                                phase = data.phases[i];
                                if (phaseId2 == phase._id) {
                                    break;
                                }
                            }
                            equal(phase.phaseType, "Applying", "Checking Phase 2");

                            changePhase(applicationId1, false, function(data) {
                                phaseId1 = data.phaseId;

                                getPhases(applicationId1, function(data) {
                                    for (var i=0; i<data.phases.length; i++) {
                                        phase = data.phases[i];
                                        if (phaseId1 == phase._id) {
                                            break;
                                        }
                                    }
                                    equal(phase.phaseType, "Interviewing", "Checking Phase 1");

                                    getPhases(applicationId2, function(data) {
                                        for (var i=0; i<data.phases.length; i++) {
                                            phase = data.phases[i];
                                            if (phaseId2 == phase._id) {
                                                break;
                                            }
                                        }
                                        equal(phase.phaseType, "Applying", "Checking Phase 2");
                                        start();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Creating tasks with and without descriptions (space)
asyncTest("Create Tasks With and Without Descriptions and Dates", function() {
    expect(11);
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                createTask(phaseId, " ", undefined ,function(data) {
                    var taskId1 = data.taskId;
                    var curTime = new Date();

                    createTask(phaseId, "YOLO SWAG", curTime, function(data) {
                        var taskId2 = data.taskId;

                        getTasks(phaseId, function(data){
                            for (var i = 0; i<data.tasks.length; i++) {
                                var task = data.tasks[i];

                                if (task._id == taskId1) {
                                    equal(task.description, " ", "Test Empty Task Description");
                                    equal(task.dueDate, undefined, "Test Empty Date");

                                } else if (task._id == taskId2) {
                                    equal(task.description, "YOLO SWAG", "Test Nonempty Task Description");
                                    equal(toString(new Date (task.dueDate)), toString(curTime), "Test Nonempty Date");
                                }
                            }

                            start();
                        });
                    });
                });
            });
        });
    });
});

// Editing task descriptions, dates, and completed
asyncTest("Edit Task Descriptions, Dates, and Completed", function() {
    expect(21);
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                createTask(phaseId, " ", undefined ,function(data) {
                    var taskId1 = data.taskId;


                    createTask(phaseId, " ", undefined, function(data) {
                        var taskId2 = data.taskId;

                        getTasks(phaseId, function(data){
                            for (var i = 0; i<data.tasks.length; i++) {
                                var task = data.tasks[i];

                                if (task._id == taskId1) {
                                    equal(task.description, " ", "Test Empty Task Description");
                                    equal(task.dueDate, undefined, "Test Empty Due Date");
                                    equal(task.completed, false, "Test False Completed");

                                } else if (task._id == taskId2) {
                                    equal(task.description, " ", "Test Empty Task Description");
                                    equal(task.dueDate, undefined, "Test Empty Due Date");
                                    equal(task.completed, false, "Test False Completed");
                                }
                            }

                            var curTime = new Date();

                            editTask(taskId1, "Change 1", curTime, true, function(data) {
                                getTasks(phaseId, function(data) {
                                    for (var i = 0; i<data.tasks.length; i++) {
                                        var task = data.tasks[i];

                                        if (task._id == taskId1) {
                                            equal(task.description, "Change 1", "Test edit 1");
                                            equal(toString(new Date(task.dueDate)), toString(curTime), "Test edit 1");
                                            equal(task.completed, true, "Test edit 1");

                                        } else if (task._id == taskId2) {
                                            equal(task.description, " ", "Make sure edit 1 didnt change task 2 description");
                                            equal(task.dueDate, undefined, "Make sure edit 1 didnt change task 2 date");
                                            equal(task.completed, false, "Make sure edit 1 didnt change task 2 completed");
                                        }
                                    }

                                    start();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Creating and deleting tasks
asyncTest("Create and Delete Tasks With and Without Descriptions and Dates", function() {
    expect(17);
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                getTasks(phaseId, function(data){
                    equal(data.tasks.length, 0, "Count Initial Num of Tasks");

                    createTask(phaseId, " ", undefined ,function(data) {
                        var taskId1 = data.taskId;

                        getTasks(phaseId, function(data){
                            equal(data.tasks.length, 1, "Count after adding a task");
                            var curTime = new Date();

                            createTask(phaseId, "YOLO SWAG", curTime, function(data) {
                                var taskId2 = data.taskId;

                                getTasks(phaseId, function(data){
                                    equal(data.tasks.length, 2, "Count after adding a second task");

                                    deleteTask(taskId1, function(data) {
                                        getTasks(phaseId, function(data){
                                            equal(data.tasks.length, 1, "Count after adding a second task");

                                            equal(data.tasks[0].description, "YOLO SWAG", "Check that we deleted the correct task");
                                            equal(toString(new Date(data.tasks[0].dueDate)), toString(curTime), "Check that we deleted the correct task");

                                            start();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Creating tasks at distinct phases and editing tasks within them separately
asyncTest("Create and Edit Tasks in Different Phases of Same Application", function() {
    expect(20);
    createApplication(function(data) {
        var applicationId = data.applicationId;

        changePhase(applicationId, false, function(data) {
            var phaseId1 = data.phaseId;

            getPhases(applicationId, function(data) {
                for (var i=0; i<data.phases.length; i++) {
                    phase = data.phases[i];
                    if (phaseId1 == phase._id) {
                        break;
                    }
                }
                equal(phase.phaseType, "Applying", "Checking Phase");

                createTask(phaseId1, " ", undefined ,function(data) {
                    var taskId1 = data.taskId;

                    changePhase(applicationId, false, function(data) {
                        var phaseId2 = data.phaseId;

                        createTask(phaseId2, " ", undefined, function(data) {
                            var taskId2 = data.taskId;

                            getTasks(phaseId2, function(data){
                                for (var i = 0; i<data.tasks.length; i++) {
                                    var task = data.tasks[i];

                                    if (task._id == taskId2) {
                                        equal(task.description, " ", "Test New Task Description");
                                        equal(task.dueDate, undefined, "Test New Task Due Date");
                                        equal(task.completed, false, "Test New Task Completed");

                                    } else if (task._id == taskId1) {
                                        ok(false, "Old task was found in new phase");
                                    }
                                }
                                var curTime = new Date();

                                editTask(taskId2, "Change 2", curTime, true, function(data) {
                                    getTasks(phaseId2, function(data) {
                                        for (var i = 0; i<data.tasks.length; i++) {
                                            var task = data.tasks[i];

                                            if (task._id == taskId2) {
                                                equal(task.description, "Change 2", "Test edit 2 Description");
                                                equal(toString(new Date(task.dueDate)), toString(curTime), "Test edit 2 Date");
                                                equal(task.completed, true, "Test edit 2 completed");

                                            } else if (task._id == taskId1) {
                                                ok(false, "Old task was found in new phase");
                                            }
                                        }

                                        getTasks(phaseId1, function(data){
                                            for (var i = 0; i<data.tasks.length; i++) {
                                                var task = data.tasks[i];

                                                if (task._id == taskId1) {
                                                    equal(task.description, " ", "Test Old Task Description");
                                                    equal(task.dueDate, undefined, "Test Old Task Date");
                                                    equal(task.completed, false, "Test Old Task Completed");

                                                } else if (task._id == taskId2) {
                                                    ok(false, "New task was found in old phase");
                                                }
                                            }

                                            start();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});