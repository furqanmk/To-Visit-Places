Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
  Template.body.helpers({
  	tasks: function() {
		if (Session.get("hideCompleted")) {
			return Tasks.find( {checked: {$ne: true}}, {sort: {createAt: -1}} );
		}
		else {
			return Tasks.find( {}, {sort: {createAt: -1}} );
		}
		
	},
	incompleteTasks: function() {
		return Tasks.find({checked: {$ne: true}}).count();
	}
  });
  
  Template.body.events({
  	"submit .new-task": function(event) {
		var text = event.target.text.value;
		
		Tasks.insert({ 
			text: text, 
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.username			
		});
		
		event.target.text.value = "";
		
		return false;
	},
	
	"click .delete": function() {
		Tasks.remove(this._id);
	},
	
	"click .toggle-checked": function() {
		Tasks.update(this._id, {$set: {checked: !this.checked}});	
	},
	
	"change .hide-completed input": function(event) {
		Session.set("hideCompleted", event.target.checked);
	}
  });
  

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
