function displayApplications(applications) {
    var list = $('#application-list');
    list.append(Handlebars.templates['applications']({
        applications: applications
    }));
}