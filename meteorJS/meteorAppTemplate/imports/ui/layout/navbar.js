import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './navbar.html';

navbar = [{
    title: "Incidents",
    desc: "Menu Item 1 Example",
    items: [{
        title: "Manage Incidents",
        ref: "Incident",
        desc: "Just a little CRUD",
        d_index: false,
    }, ],
}, {
    title: "Circulars",
    desc: "Menu Item 2 Example",
    items: [{
        title: "Manage Circulars",
        ref: "Circular",
        desc: "Just a little CRUD",
        d_index: false,
    }, ],
}, {
    title: "Reports",
    desc: "Menu Item 3 Example",
    items: [{
        title: "Manage Reports",
        ref: "Report",
        desc: "Just a little CRUD",
        d_index: false,
    }, ],
}, {
    title: "Penalties",
    desc: "Menu Item 4 Example",
    items: [{
        title: "Elaborate P1",
        ref: "P1",
        desc: "Elaborate P1",
        d_index: true,
    }, {
        title: "Elaborate P2",
        ref: "P2",
        desc: "Elaborate P2",
        d_index: true,
    }, {
        title: "Elaborate P3",
        ref: "P3",
        desc: "Elaborate P3",
        d_index: true,
    }, {
        title: "Elaborate P4",
        ref: "P4",
        desc: "Elaborate P4",
        d_index: true,
    }, {
        title: "Elaborate P5",
        ref: "P5",
        desc: "Elaborate P5",
        d_index: false,
    }, ],
}, {
    title: "Settings",
    desc: "Menu Item 5 Example",
    items: [{
        title: "Imports",
        ref: "Import",
        desc: "Import relevant data",
        d_index: true,
    }, {
        title: "Invoices",
        ref: "Invoice",
        desc: "CRUD Invoice",
        d_index: true,
    }, {
        title: "Branches",
        ref: "Branch",
        desc: "CRUD Branches",
        d_index: true,
    }, {
        title: "Carriers",
        ref: "Carrier",
        desc: "CRUD Carriers",
        d_index: true,
    }, {
        title: "Parameters",
        ref: "Parameter",
        desc: "CRUD Parameters",
        d_index: true,
    }, {
        title: "Users",
        ref: "User",
        desc: "CRUD Users",
        d_index: false,
    }, ],
}, ];

function breadHide(){
  $("#bread_2").hide();
  $("#bread_3").hide();
  $("#bread_4").hide();
};

Template.navbar.rendered = function() {
    $(".menu_item").mouseover(function() {
        $(this).click();
        // $(this).css('text-decoration', 'underline');
    });
    $(".menu_item").mouseout(function() {
        $(this).css('text-decoration', 'none');
    });
    $(".sub_item").mouseover(function() {
        $(this).css('text-decoration', 'underline');
    });
    $(".sub_item").mouseout(function() {
        $(this).css('text-decoration', 'none');
    });

    $(".sub_item").click(function(){
        if($(window).width() <= 753){
            $(".navbar-toggle").click();
            // $(".navbar-collapse").collapse('hide');
        };
    });
    $(".dropdown-menu").mouseleave(function() {
        $(this).parent().click();
    });
};

Template.navbar.helpers({
    navbar:navbar,
    items:navbar.items,
});

Template.navbar.events({
    'click .js-click': function(event) {
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #bread_1': function(event){
        breadHide();
        const href = "Home";
        Session.set('activeModal', href);
    },
    'click #bread_3': function(event){
        const href = $("#bread_3").text();
        Session.set('activeModal', href);
    },
});
