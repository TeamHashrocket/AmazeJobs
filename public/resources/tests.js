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
        success     : function(data) { success(data); }
    });
}

function createApplication(callback) {
    ajax({ companyName:"YOLOsoft" }, "/user/"+userId+"/applications", "POST", "Create Application", callback);
}

function deleteApplication(applicationId, callback) {
    ajax({}, "/application/" + applicationId, "DELETE", "Delete Application", callback);
}

function getApplications(name, callback) {
    ajax({}, "/user/"+userId+"/applications", "GET", name, callback);
}

function createPhase(applicationId, phaseType, callback) {
    ajax({phaseType:phaseType}, "/application/"+applicationId+"/phases", "POST", "Create Phase", callback);
}

function deletePhase(phaseId, callback) {
    ajax({phaseType:phaseType}, "/phase/"+phaseId, "DELETE", "Delete Phase", callback);
}

function getPhases(name, applicationId, callback) {
    ajax({}, "/application/"+applicationId+"/phases", "GET", name, callback);
}

function changePhase(applicationId, terminated, callback) {
    ajax({terminated:terminated}, "/application/"+applicationId, "PUT", terminated ? "Terminate Phase" : "Change Phase", callback)
}

// Tests require a user with the email hashr0ck3t@gmail.com to exist on the server first
// cannot automate google login

// adds two apps, removes two apps and counts in between
asyncTest("Create & Delete application", function() {
    expect(9);

    getApplications("Count Initial Applications", function(data) {
        var initialNumApps = data.applications.length;
        ok(true, "Count Initial Applications")
 
        createApplication(function(data) {
            ok(true, "Create Application");
            var applicationId1 = data.applicationId;

            getApplications("Count After Adding Apps", function(data) {
                var newNumApps = data.applications.length;
                equal(newNumApps - 1, initialNumApps, "Count After Adding App");

                createApplication(function(data) {
                    ok(true, "Create Application");
                    var applicationId2 = data.applicationId;

                    getApplications("Count After Adding Another App", function(data) {
                        newNumApps = data.applications.length;
                        equal(newNumApps - 2, initialNumApps, "Count After Adding Another App");

                        deleteApplication(applicationId1, function(data) {
                            ok(true, "Delete Application");

                            getApplications("Count After Deleting Apps", function(data) {
                                newNumApps = data.applications.length;
                                equal(newNumApps - 1, initialNumApps, "Count After Deleting App");

                                deleteApplication(applicationId2, function(data) {
                                    ok(true, "Delete Application");

                                    getApplications("Count After Deleting Apps", function(data) {
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


asyncTest("Go Through All Phases", function() {
    expect(2);
    setTimeout( function(){
        createApplication(function(data) {
            ok(true, "Create Application");
            var applicationId = data.applicationId;

            createPhase(applicationId, "Applying", function(data) {
                var phaseId = data.phaseId;
                ok(true, "Created Application Phase");

                getPhases("Checking Phase", applicationId, function(data) {
                    for (var i=0; i<data.phases.length; i++) {
                        phase = data.phases[i];
                        if (phaseId == phase._id) {
                            break;
                        }
                    }
                    equal(phase.phaseType, "Applying", "Checking Phase");

                    changePhase(applicationId, false, function(data) {
                        phaseId = data.phaseId;
                        console.log(phaseId)
                        ok(true, "Changed Phase");

                        getPhases("Checking Phase", applicationId, function(data) {
                            for (var i=0; i<data.phases.length; i++) {
                                phase = data.phases[i];
                                if (phaseId == phase._id) {
                                    break;
                                }
                            }
                            equal(phase.phaseType, "Interviewing", "Checking Phase");

                            changePhase(applicationId, false, function(data) {
                                phaseId = data.phaseId;console.log(phaseId)
                                ok(true, "Changed Phase");

                                getPhases("Checking Phase", applicationId, function(data) {
                                    for (var i=0; i<data.phases.length; i++) {
                                        phase = data.phases[i];
                                        if (phaseId == phase._id) {
                                            break;
                                        }
                                    }
                                    equal(phase.phaseType, "Offered", "Checking Phase");

                                    changePhase(applicationId, false, function(data) {
                                        phaseId = data.phaseId;
                                        console.log(phaseId)
                                        ok(true, "Changed Phase");

                                        getPhases("Checking Phase", applicationId, function(data) {
                                            for (var i=0; i<data.phases.length; i++) {
                                                phase = data.phases[i];
                                                if (phaseId == phase._id) {
                                                    break;
                                                }
                                            }
                                            equal(phase.phaseType, "Terminated", "Checking Phase");
                                            phaseId = data.phaseId;
                                            console.log(phaseId)
                                            deleteApplication(applicationId, function() {
                                                ok(true, "Deleted Application")
                                            });
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
    }, 1000)
});