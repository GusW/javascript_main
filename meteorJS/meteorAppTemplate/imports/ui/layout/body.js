import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './body.html';
import './header.js';
import './footer.js';
import './login.js';
import './home.js';
import '../system.js';

fadeInModalBody = function(template) {
    setTimeout(function() {
        Session.set('activeModal', template);
    }, 5001);
};

Template.modalBody.created = function(){
    let href;
    if (Meteor.user()){
        href = 'Home';
    } else {
        href = 'Login';
    };
    Session.set('activeModal', href);
};

Template.modalBody.helpers({
  activeModal: function() {
      return Session.get('activeModal');
  },
});
