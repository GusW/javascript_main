import {
    Users
} from '../../api/users.js';
import './login.html';
import '../layout/popup.js';
import '../layout/alert.js';
import '../layout/header.js';

let dateFormat = require('dateformat');

const objectName = "Login";

var object = {
    name: objectName,
    menu: "",
    title: objectName,
    username: "Username",
    inputUsername: "inputUsername",
    password: "Password",
    inputPassword: "inputPassword",
};

const alertClass = $(".alert");
const inputUsername = "#" + object.inputUsername;
const inputPassword = "#" + object.inputPassword;

Template.Login.created = function() {
    Meteor.subscribe("users");
};

Template.Login.helpers({
    object: object,
});

Template.Login.events({
    'submit form': function(event) {
        event.preventDefault();
        const username = $(inputUsername).val();
        const pass = $(inputPassword).val();
        Meteor.loginWithPassword({
            username: username
        }, pass, function(err) {
            if (err) {
                alert.type = "alert-danger";
                alert.message =  "The provided USER and/or PASSWORD does NOT match our registers. Please revise and try again.";
                showHideAlert(alertClass);
            } else {
                Meteor.call("users.setSuccess", Meteor.userId(), dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"));
                Session.set('activeModal', 'Home');
            };
        });
    },
});
