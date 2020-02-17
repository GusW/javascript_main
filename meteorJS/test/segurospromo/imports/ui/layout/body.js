import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './body.html';
import './navbar.js';
import './footer.js';
import '../system.js';

fadeInModalBody = function(template) {
    setTimeout(function() {
        Session.set('activeModal', template);
    }, 5001);
};

Template.modalBody.helpers({
  activeModal: function() {
      return Session.get('activeModal');
  },
});
