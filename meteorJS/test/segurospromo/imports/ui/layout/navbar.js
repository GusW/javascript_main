import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './navbar.html';
import '../components/quotation.js';
import '../components/purchase.js';
import '../system.js';

navbar = [{
    title: "Cotações",
    desc: "Menu Cotações",
    items: [{
        title: "Cotações",
        ref: "Quotation",
        desc: "Teste Desenvolvedor 2XT",
        d_index: false,
    },{
        title: "Compras",
        ref: "Purchase",
        desc: "Teste Desenvolvedor 2XT",
        d_index: false,
    }, ],
}, ];

Template.navbar.rendered = function() {
    $(".sub_item").click(function(){
        if($(window).width() <= 753){
            $(".navbar-toggle").click();
        };
    });
    $(".dropdown-menu").mouseleave(function() {
        $(this).parent().click();
    });
    $("#Cotações").click();
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
});
