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

asyncTest("Create & Delete application", function() {
    expect(5);

    ajax({userId:userId}, "/applications", "GET", "Count Initial Applications", function(data) {
        var initialNumApps = data.applications.length;
        ok(true, "Count Initial Applications")
 
        ajax({ userId:userId, companyName:"YOLOsoft" }, "/applications", "POST", "Create Application", function(data) {
            ok(true, "Create Application");
            var applicationId = data.applicationId;

            ajax({userId:userId}, "/applications", "GET", "Count After Adding Apps", function(data) {
                var newNumApps = data.applications.length;
                equal(newNumApps - 1, initialNumApps, "Count After Adding Apps");

                ajax({}, "/application/" + applicationId, "DELETE", "Delete Application", function(data) {
                    ok(true, "Delete Application");

                    ajax({userId:userId}, "/applications", "GET", "Count After Deleting Apps", function(data) {
                        newNumApps = data.applications.length;
                        equal(newNumApps, initialNumApps, "Count After Deleting Apps")
                        start();
                    });
                });
            });
        });
    });
});

asyncTest("Testing Tasks", function() {
    expect(1);
    ok(true,"YOLO")
    start();
});