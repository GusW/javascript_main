import {
    Parameters
} from '../../api/parameters.js';
import './parameter.html';
import '../layout/popup.js';
import '../layout/alert.js';

const objectName = "Parameter";

var object = {
    name: objectName,
    menu: "Settings",
    title: "Manage " + objectName,
    titleEdit: "Edit " + objectName,
    factor01: "Factor #1",
    inputF1: "inputF1",
    factor02: "Factor #2",
    inputF2: "inputF2",
    factor03: "Factor #3",
    inputF3: "inputF3",
    factor04: "Factor #4",
    inputF4: "inputF4",
};

var activeObject = {
    penalty:"",
    factor01:0,
    factor02:0,
    factor03:0,
    factor04:0,
};

var dtData = function() {
    return Parameters.find().fetch();
};

const alertClass = $(".alert");
const inputF1 = "#" + object.inputF1;
const inputF2 = "#" + object.inputF2;
const inputF3 = "#" + object.inputF3;
const inputF4 = "#" + object.inputF4;

function renderEditObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN"){
        return "<a href='#' id='" + currentRow._id + "' data-page='ParameterEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>";
    }
    return null;
};

const dtOptions = {
    columns: [{
        title: 'Penalty',
        data: 'penalty',
        className: '',
    }, {
        title: 'Factor #1',
        data: 'factor01',
        className: 'floatCenter',
    }, {
        title: 'Factor #2',
        data: 'factor02',
        className: 'floatCenter',
    }, {
        title: 'Factor #3',
        data: 'factor03',
        className: 'floatCenter',
    }, {
        title: 'Factor #4',
        data: 'factor04',
        className: 'floatCenter',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderEditObject,
    },  ],
    "columnDefs": [{
        "width": "18%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "20%",
        "targets": 2
    }, {
        "width": "20%",
        "targets": 3
    }, {
        "width": "20%",
        "targets": 4
    }, {
        "width": "0.1%",
        "targets": 5
    },],
    searching: false,
    autoWidth: true,
    "responsive": true,
    "stateSave": true,
    "language": {
        "lengthMenu": dt_EN.lengthMenu,
        "zeroRecords": dt_EN.zeroRecords,
        "info": dt_EN.info,
        "infoEmpty": dt_EN.infoEmpty,
        "infoFiltered": dt_EN.infoFiltered,
        "paginate": {
            "first": dt_EN.paginate.first,
            "last": dt_EN.paginate.last,
            "next": dt_EN.paginate.next,
            "previous": dt_EN.paginate.previous,
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
};

////////////////////////////////////////////////////////////////////////////////

Template.Parameter.created = function() {
    Meteor.subscribe("parameters");
};

Template.Parameter.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
};

Template.Parameter.helpers({
    object: object,
    reactiveDataFunction: function() {
        return dtData;
    },
    dtOptions: dtOptions,
});

Template.Parameter.events({
    'click .js-edit': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const paremeter = Parameters.findOne(id);
        activeObject = {
            penalty:paremeter.penalty,
            factor01:paremeter.factor01,
            factor02:paremeter.factor02,
            factor03:paremeter.factor03,
            factor04:paremeter.factor04,
        };
        Session.set('activeModal', href);
    },
    'click #btnExport': function(event) {
        event.preventDefault();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
            Penalty: "Penalty",
            Factor01: "Factor #1",
            Factor02: "Factor #2",
            Factor03: "Factor #3",
            Factor04: "Factor #4",
        };
        exportList.push(obj);
        const objects = dtData();
        console.log(objects);
        for (var i = 0; i < objects.length; i++) {
            obj = {
                Penalty: objects[i].penalty,
                Factor01: objects[i].factor01,
                Factor02: objects[i].factor02,
                Factor03: objects[i].factor03,
                Factor04: objects[i].factor04,
            };
            exportList.push(obj);
            q++;
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Parameters");
            alert.type = "alert-success";
            alert.message = "The " + objectName + " List was successfully exported with " + q + " register(s)."
            showHideAlert(alertClass);
        } else {
            alert.type = "alert-warning";
            alert.message = "There is NO register matching your criteria. Please verify and try again.";
            showHideAlert(alertClass);
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.ParameterEdit.created = function() {
    Meteor.subscribe("carriers");
};

Template.ParameterEdit.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    const input01 = document.getElementById('inputF1');
    const input02 = document.getElementById('inputF2');
    const input03 = document.getElementById('inputF3');
    const input04 = document.getElementById('inputF4');
    input01.autocomplete = 'off';
    input02.autocomplete = 'off';
    input03.autocomplete = 'off';
    input04.autocomplete = 'off';
    $(inputF1).inputmask("numeric");
    $(inputF2).inputmask("numeric");
    $(inputF3).inputmask("numeric");
    $(inputF4).inputmask("numeric");
};

Template.ParameterEdit.helpers({
    object: object,
    activeObject() {
        return activeObject
    },
});

Template.ParameterEdit.events({
    'click #btnCancel': function(event) {
        const factor01 = $(inputF1).val();
        const factor02 = $(inputF2).val();
        const factor03 = $(inputF3).val();
        const factor04 = $(inputF4).val();
        popup.back = objectName;
        if (factor01 != activeObject.factor01 || factor02 != activeObject.factor02 || factor03 != activeObject.factor03 || factor04 != activeObject.factor04) {
            popup.type = "parameterEdit_Back";
            popup.title = "Exit without Saving";
            popup.message = "Do you really wish to quit without saving?";
            popup.no = "Cancel";
            popup.yes = "Yes, exit";
            popup.popupId = "";
            Modal.show('popup');
        } else {
            Session.set('activeModal', popup.back);
        };
    },
    'submit form': function(event) {
        event.preventDefault();
        popup.back = objectName;
        const factor01 = $(inputF1).val();
        const factor02 = $(inputF2).val();
        const factor03 = $(inputF3).val();
        const factor04 = $(inputF4).val();
        if (factor01 == activeObject.factor01 && factor02 == activeObject.factor02 && factor03 == activeObject.factor03 && factor04 == activeObject.factor04) {
            alert.type = "alert-warning";
            alert.message = "The Parameter was NOT saved because there is NO changes to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (factor01 != "" && factor02 != "" && factor03 != "" && factor04 != ""){
            popup.type = "paremeterEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            popupAux.param1 = factor01;
            popupAux.param2 = factor02;
            popupAux.param3 = factor03;
            popupAux.param4 = factor04;
            Modal.show('popup');
        };
    },
});
