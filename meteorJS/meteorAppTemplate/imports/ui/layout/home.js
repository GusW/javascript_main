import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    Circulars
} from '../../api/circulars.js';
import {
    Incidents
} from '../../api/incidents.js';
import {
    Reports
} from '../../api/reports.js';
import './home.html';
import '../components/penalty4.js';

let dateFormat = require('dateformat');

function openCirculars(){
    let amount = 0;
    const today = dateFormat(new Date(), "mm/yyyy");
    const circulars = Circulars.find().fetch();
    for (let i = 0; i < circulars.length; i++){
        let opening = new Date(circulars[i].oDate);
        let limit = circular_lim(circulars[i]._id);
        let target = opening.setDate(opening.getDate() + limit);
        if (dateFormat(target, "mm/yyyy") === today){
            amount++;
        }
    }
    return amount;
};

function openIncidents(){
    let amount = 0;
    const today = dateFormat(new Date(), "mm/yyyy");
    const incidents = Incidents.find().fetch();
    for (let i = 0; i < incidents.length; i++){
        if (dateFormat((incidents[i].cDate), "mm/yyyy") === today){
            amount++;
        }
    }
    return amount;
};

function openReports(){
    let amount = 0;
    const today = dateFormat(new Date(), "mm/yyyy");
    const reports = Reports.find().fetch();
    for (let i = 0; i < reports.length; i++){
        if (dateFormat((reports[i].dDate), "mm/yyyy") === today){
            amount++;
        }
    }
    return amount;
};

Template.Home.created = function() {
    Meteor.subscribe("incidents");
    Meteor.subscribe("circulars");
    Meteor.subscribe("reports");
};

Template.Home.rendered = function() {
    $("#bread_2").hide();
    $("#bread_3").hide();
    $("#bread_4").hide();
};

Template.Home.helpers({
    openCirculars:openCirculars,
    circularType(){
        let type;
        if (openCirculars() > 0){
            type = "danger";
        } else {
            type = "primary";
        }
        return type;
    },
    openIncidents:openIncidents,
    incidentType(){
        let type;
        if (openIncidents() > 0){
            type = "danger";
        } else {
            type = "primary";
        }
        return type;
    },
    openReports:openReports,
    reportType(){
        let type;
        if (openReports() > 0){
            type = "danger";
        } else {
            type = "primary";
        }
        return type;
    },
});
