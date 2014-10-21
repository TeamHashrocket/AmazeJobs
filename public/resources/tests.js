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
    ajax({}, "/application/" + applicationId, "DELETE", "Delete Application", callback);
}

function getApplications(callback) {
    ajax({}, "/user/"+userId+"/applications", "GET", "Get Applications", callback);
}

function getPhases(applicationId, callback) {
    ajax({}, "/application/"+applicationId+"/phases", "GET", "Get Phases", callback);
}

function changePhase(applicationId, terminated, callback) {
    ajax({terminated:terminated}, "/application/"+applicationId, "PUT", terminated ? "Terminate Phase" : "Change Phase", callback)
}

function createTask(phaseId, description, callback) {
    ajax({description:description}, "/phase/"+phaseId+"/tasks", "POST", "Created Task", callback);
}

function deleteTask(taskId, callback) {
    ajax({}, "/task/"+taskId, "DELETE", "Delete Task", callback);
}

function editTask(taskId, description, callback) {
    ajax({description:description}, "/task/"+taskId, "PUT", "Edited task", callback);
}

function getTasks(phaseId, callback) {
    ajax({}, "/phase/"+phaseId+"/tasks", "GET", "Get Tasks", callback);
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
    expect(12);
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
                                    equal(phaseId, undefined, "Does not go past Offered");

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
asyncTest("Create Tasks With and Without Descriptions", function() {
    expect(9);
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

                createTask(phaseId, " " ,function(data) {
                    var taskId1 = data.taskId;

                    createTask(phaseId, "YOLO SWAG", function(data) {
                        var taskId2 = data.taskId;

                        getTasks(phaseId, function(data){
                            for (var i = 0; i<data.tasks.length; i++) {
                                var task = data.tasks[i];

                                if (task._id == taskId1) {
                                    equal(task.description, " ", "Test Empty Task Description");

                                } else if (task._id == taskId2) {
                                    equal(task.description, "YOLO SWAG", "Test Nonempty Task Description");
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

// Editing task descriptions
asyncTest("Edit Task Descriptions", function() {
    expect(13);
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

                createTask(phaseId, " " ,function(data) {
                    var taskId1 = data.taskId;


                    createTask(phaseId, " ", function(data) {
                        var taskId2 = data.taskId;

                        getTasks(phaseId, function(data){
                            for (var i = 0; i<data.tasks.length; i++) {
                                var task = data.tasks[i];

                                if (task._id == taskId1) {
                                    equal(task.description, " ", "Test Empty Task Description");

                                } else if (task._id == taskId2) {
                                    equal(task.description, " ", "Test Empty Task Description");
                                }
                            }

                            editTask(taskId1, "Change 1", function(data) {
                                getTasks(phaseId, function(data) {
                                    for (var i = 0; i<data.tasks.length; i++) {
                                        var task = data.tasks[i];

                                        if (task._id == taskId1) {
                                            equal(task.description, "Change 1", "Test edit 1");

                                        } else if (task._id == taskId2) {
                                            equal(task.description, " ", "Make sure edit 1 didnt change task 2");
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
asyncTest("Create Tasks With and Without Descriptions", function() {
    expect(16);
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

                    createTask(phaseId, " " ,function(data) {
                        var taskId1 = data.taskId;

                        getTasks(phaseId, function(data){
                            equal(data.tasks.length, 1, "Count after adding a task");

                            createTask(phaseId, "YOLO SWAG", function(data) {
                                var taskId2 = data.taskId;

                                getTasks(phaseId, function(data){
                                    equal(data.tasks.length, 2, "Count after adding a second task");

                                    deleteTask(taskId1, function(data) {
                                        getTasks(phaseId, function(data){
                                            equal(data.tasks.length, 1, "Count after adding a second task");

                                            equal(data.tasks[0].description, "YOLO SWAG", "Check that we deleted the correct task");
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
    expect(14);
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

                createTask(phaseId1, " " ,function(data) {
                    var taskId1 = data.taskId;

                    changePhase(applicationId, false, function(data) {
                        var phaseId2 = data.phaseId;

                        createTask(phaseId2, " ", function(data) {
                            var taskId2 = data.taskId;

                            getTasks(phaseId2, function(data){
                                for (var i = 0; i<data.tasks.length; i++) {
                                    var task = data.tasks[i];

                                    if (task._id == taskId2) {
                                        equal(task.description, " ", "Test New Task Description");

                                    } else if (task._id == taskId1) {
                                        ok(false, "Old task was found in new phase");
                                    }
                                }

                                editTask(taskId2, "Change 2", function(data) {
                                    getTasks(phaseId2, function(data) {
                                        for (var i = 0; i<data.tasks.length; i++) {
                                            var task = data.tasks[i];

                                            if (task._id == taskId2) {
                                                equal(task.description, "Change 2", "Test edit 2");

                                            } else if (task._id == taskId1) {
                                                ok(false, "Old task was found in new phase");
                                            }
                                        }

                                        getTasks(phaseId1, function(data){
                                            for (var i = 0; i<data.tasks.length; i++) {
                                                var task = data.tasks[i];

                                                if (task._id == taskId1) {
                                                    equal(task.description, " ", "Test Old Task Description");

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