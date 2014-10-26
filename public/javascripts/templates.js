(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['application'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class='application' app-id="
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.application : depth0)) != null ? stack1._id : stack1), depth0))
    + ">\n    <p>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.application : depth0)) != null ? stack1.companyName : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.application : depth0)) != null ? stack1.currentPhase : stack1)) != null ? stack1.phaseType : stack1), depth0))
    + "</p>\n</div>";
},"useData":true});
templates['applications'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.application, '    ', 'application', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<h1>Applications</h1>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.applications : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"usePartial":true,"useData":true});
templates['openApplication'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.task, '    ', 'task', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "        <button class='next-phase'>"
    + escapeExpression(((helper = (helper = helpers.nextPhase || (depth0 != null ? depth0.nextPhase : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nextPhase","hash":{},"data":data}) : helper)))
    + "</button>\n        <button class='terminate'>Terminate</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tasks : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n<a href='#' class='add-task'>+ Add Task... (MM/DD/YYYY)</a>\n<div class='footer'>\n    <button class='delete-application'>Delete</button>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.nextPhase : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"usePartial":true,"useData":true});
templates['task'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  	<input type=\"checkbox\" name="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + " checked>\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  	<input type=\"checkbox\" name="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n  	<label>"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"dueDate","hash":{},"data":data}) : helper)))
    + "</label>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"task\" data-task-id="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n  <div class=\"ui checkbox\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.completed : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n</div>\n";
},"useData":true});
templates['tasks'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.task, '        ', 'task', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"tasks\">\n    <div class=\"subtitle out-text\">"
    + escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"label","hash":{},"data":data}) : helper)))
    + "</div>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tasks : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"usePartial":true,"useData":true});
})();
