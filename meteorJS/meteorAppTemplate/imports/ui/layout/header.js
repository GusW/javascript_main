import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './header.html';
import '../system.js';
import './home.js';
import './navbar.js';
import './info.js';
import '../components/branch.js';
import '../components/carrier.js';
import '../components/invoice.js';
import '../components/parameter.js';
import '../components/user.js';
import '../components/report.js';
import '../components/circular.js';
import '../components/incident.js';
import '../components/import.js';
import '../components/penalty1.js';
import '../components/penalty2.js';
import '../components/penalty3.js';
import '../components/penalty4.js';
import '../components/penalty5.js';

function breadHide(){
  $("#bread_2").hide();
  $("#bread_3").hide();
  $("#bread_4").hide();
};

Template.header.helpers({
  system:system,
});

Template.header.events({
  'click .logo': function(event){
      breadHide();
      const href = $(event.target).attr("data-page");
      Session.set('activeModal', href);
  },
});
