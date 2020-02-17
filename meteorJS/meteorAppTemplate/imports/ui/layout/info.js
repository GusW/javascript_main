import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './info.html';
import './popup.js';
import '../system.js';

Template.info.helpers({
  system:system,
});

Template.info.events({
    'click #btnSessionInfo': function(event){
        event.preventDefault();
        user.id = Meteor.userId();
        Modal.show('userInfo');
    },

    'click #btnSessionLogout': function(event){
        event.preventDefault();
        popup.type = "logOut";
        popup.title = "Logout";
        popup.message = "Are you sure you want to logout?";
        popup.no = "Cancel";
        popup.yes = "Yes, logout";
        Modal.show('popup');
    },
});
