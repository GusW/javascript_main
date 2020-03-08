import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './footer.html';
import '../system.js'

Template.footer.helpers({
  system:system,
})
