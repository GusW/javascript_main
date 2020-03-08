import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './alert.html';

alert = {
    type: "",
    message: "",
};

const alertClass = $("#alert-class");

showHideAlert = function() {
    const alertDiv = $("#alert-class");
    alertDiv.removeClass("alert-warning").removeClass("alert-success").removeClass("alert-info").removeClass("alert-danger");
    alertDiv.addClass(alert.type);
    alertDiv.html(alert.message);
    $(".alertBasic").show();
    setTimeout(function() {
        $(".alertBasic").hide();
    }, 5000);
};

Template.alert.helpers({
    alert:alert,
});
