$(document).on('submit', '#login', function(evt) {
  evt.preventDefault();
  $.get(
    '/login'
  ).done(function(response) {
    currentUser = response.content.user;
    loadHomePage();
  }).fail(function(jqxhr) {
    var response = $.parseJSON(jqxhr.responseText);
    loadPage('signin', {error: response.err});
  });
});