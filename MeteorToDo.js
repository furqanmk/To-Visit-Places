/*============= Server+Client Code =============*/

Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	
	/*============= Configures the app to use Login/Signup =============*/
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
	
	/*============= Template Helpers =============*/
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
			return taskCount();
		},
		incompleteTasksExist: function() {
			if (taskCount() > 0) {
				console.log(taskCount());
				return true;
			} else {
				console.log(taskCount());
				return false;
			}
		}
  	});
	
	/*============= Reusable Functions =============*/
	function taskCount() {
		return Tasks.find({checked: {$ne: true}}).count();
	}
	
  	/*============= Event Handlers =============*/
	Template.body.events({
		"submit .new-task": function(event) {
			
			var text = event.target.text.value;
			Meteor.call('addTask', text);
			
			event.target.text.value = "";
			return false;
		},
		
		"click .delete": function() {
			Meteor.call('removeTask', this._id);
		},
		
		"click .toggle-checked": function() {
			Meteor.call('setChecked', this._id, !this.checked);	
		},
		
		"change .hide-completed input": function(event) {
			Session.set("hideCompleted", event.target.checked);
		}
	});
  

}

Meteor.methods({
	addTask: function(text) {
		if (! Meteor.userId()) {
			throw new Meteor.error("not-authorized");
		}
		
		Tasks.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},
	removeTask: function(taskId) {
		Tasks.remove(taskId);
	},
	setChecked: function(taskId, setChecked) {
		Tasks.update(taskId, {$set: {checked: setChecked}});
	}
});

if (Meteor.isServer) {
  Meteor.startup(function () { 
    // code to run on server at startup
  });
}
