import {
    Branches
} from '../../api/branches.js';
import {
    Circulars
} from '../../api/circulars.js';
import {
    Incidents
} from '../../api/incidents.js';
import {
    Invoices
} from '../../api/invoices.js';
import {
    Reports
} from '../../api/reports.js';
import {
    Users
} from '../../api/users.js';
import './branch.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';
import '../layout/autocomplete.js';
import '../layout/header.js';
import '../localization.js';
import '../function.js';

const objectName = "Branch";

var object = {
    name: objectName,
    menu: "Settings",
    title: "Manage " + objectName,
    new: "BranchNew",
    titleNew: "Create " + objectName,
    edit: "BranchEdit",
    titleEdit: "Edit " + objectName,
    branchName: "Name",
    inputName: "inputBranchName",
    branchCode: "Code",
    inputCode: "inputBranchCode",
    branchCodeName: "Code/Name",
    inputCodeName: "inputCodeName",
    status: "Status",
    inputStatus: "inputStatus",
};

var activeObject = {
    code:"",
    name:"",
    status:"",
}

var dtData = function() {
    return Branches.find().fetch();
};

const alertClass = $(".alert");
const inputCode = "#" + object.inputCode;
const inputName = "#" + object.inputName;
const inputCodeName = "#" + object.inputCodeName;
const inputStatus = "#" + object.inputStatus;

////////////////////////////////////////////////////////////////////////////////

function renderEditObject(currentRow){
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN"){
        return "<a href='#' id='" + currentRow._id + "' data-page='BranchEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>"
    }
    return null;
};

function renderRemoveObject(currentRow){
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN"){
        const circulars = Circulars.find({"branch":currentRow._id}).count();
        const incidents = Incidents.find({"branch":currentRow._id}).count();
        const invoices = Invoices.find({"branch":currentRow._id}).count();
        const reports = Reports.find({"branch":currentRow._id}).count();
        const users = Users.find({"profile.branch":currentRow._id}).count();
        const total = circulars + incidents + invoices + reports + users;
        if (total === 0){
            return "<a href='#' id='" + currentRow._id + "' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>";
        }
    }
    return null;
};

const dtOptions = {
    columns: [{
        title: 'Code',
        data: 'code',
        className: 'floatCenter',
    }, {
        title: 'Name',
        data: 'name',
        className: '',
    }, {
        title: 'Status',
        data: 'status',
        className: 'floatCenter',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderEditObject,
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderRemoveObject,
    }, ],
    "columnDefs": [ {
        "width": "10%",
        "targets": 0
    }, {
        "width": "80%",
        "targets": 1
    }, {
        "width": "10%",
        "targets": 2
    }, {
        "width": "0.1%",
        "targets": 3
    }, {
        "width": "0.1%",
        "targets": 4
    }, ],
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

Template.Branch.created = function() {
    Meteor.subscribe("branches");
    Meteor.subscribe("invoices");
};

Template.Branch.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
    const input01 = document.getElementById('inputCodeName');
    input01.autocomplete = 'off';
};

Template.Branch.helpers({
    object: object,
    carriers() {
        return Branches.find({}, {
            sort: {
                carrier: 1
            }
        });
    },
    reactiveDataFunction: function() {
        return dtData;
    },
    dtOptions: dtOptions,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
            }, ]
        };
    },
    statuses: statuses,
    hasAccessProfile: function(){
        let access = false;
        if (Meteor.user().profile.access === "ADMIN"){
            access = true;
        };
        return access;
    },
});

Template.Branch.events({
    'click #btnNew': function(event) {
        const ref = object.new;
        Session.set('activeModal', ref);
    },
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click .js-remove': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        const branch = Branches.findOne(id);
        popup.objectName = objectName;
        popup.type = "branchDel";
        popup.title = "Remove " + objectName;
        popup.message = "Do you really wish to remove " + branch.codeName + "?";
        popup.no = "Cancel";
        popup.yes = "Yes, remove";
        popup.popupId = id;
        Modal.show('popup');
    },
    'click .js-edit': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const branch = Branches.findOne(id);
        activeObject = {
            code:branch.code,
            name:branch.name,
            status:branch.status,
        };
        Session.set('activeModal', href);
    },
    'click #btnFind': function(event) {
        event.preventDefault();
        const codeName = $(inputCodeName).val();
        const status = $(inputStatus).val();
        const branches = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < branches.length; i++) {
            var object = branches[i];
            var criteria = true;
            if (codeName != "") {
                if (object.codeName.toUpperCase().includes(codeName.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (status != "") {
                if (object.status == status) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    object
                );
            };
        };
        return false;
    },
    'click #btnExport':function(event){
        event.preventDefault();
        const codeName = $(inputCodeName).val();
        const status = $(inputStatus).val();
        const branches = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
          Code:"Code",
          Name:"Name",
          Status:"Status",
        };
        exportList.push(obj);
        for (var i = 0; i < branches.length; i++){
            var object = branches[i];
            var criteria = true;
            if (codeName != "") {
                if (object.codeName.toUpperCase().includes(codeName.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (status != "") {
                if (object.status == status) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                obj = {
                    Code: object.code,
                    Name: object.name,
                    Status: object.status,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Branches");
            alert.type = "alert-success";
            alert.message = "The " + objectName + " List was successfully exported with " + q + " register(s).";
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

Template.BranchNew.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleNew).addClass("active");
    $(inputCode).inputmask("9999", {
        placeholder: "0",
        numericInput: true,
    });
    const input01 = document.getElementById('inputBranchCode');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputBranchName');
    input02.autocomplete = 'off';
};

Template.BranchNew.helpers({
    object: object,
});

Template.BranchNew.events({
    'click #btnClear': function(event) {
        form.reset();
    },
    'click #btnCancel': function(event) {
        const code = $(inputCode).val();
        const name = $(inputName).val();
        popup.back = objectName;
        if (code != "" || name != "") {
            popup.type = "branchNew_Back";
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
        const code = $(inputCode).val();
        const name = $(inputName).val();
        if (code != "" && name != "") {
            popup.type = "branchNew_Save";
            popup.title = "Save new " + objectName;
            popup.message = "Do you really wish to save this new " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, save";
            const aux01 = String(code);
            const aux02 = String(name).toUpperCase();
            popupAux.old = Branches.find({
                code: aux01,
            }).count() + Branches.find({
                name: aux02,
            }).count();
            popupAux.param1 = code;
            popupAux.param2 = name;
            Modal.show('popup');
        };
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.BranchEdit.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputCode).inputmask("9999", {
        placeholder: "0"
    });
    $(inputStatus).val(activeObject.status)
    const input01 = document.getElementById('inputBranchCode');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputBranchName');
    input02.autocomplete = 'off';
};

Template.BranchEdit.helpers({
    object: object,
    activeObject() {
        return activeObject
    },
    statuses: statuses,
});

Template.BranchEdit.events({
    'click #btnCancel': function(event) {
        const code = $(inputCode).val();
        const name = $(inputName).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        if (code != activeObject.code || name != activeObject.name || status != activeObject.status) {
            popup.type = "branchEdit_Back";
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
    'click #btnClear': function(event) {
        form.reset();
    },
    'submit form': function(event) {
        event.preventDefault();
        popup.back = objectName;
        const code = $(inputCode).val();
        const name = $(inputName).val();
        const status = $(inputStatus).val();
        if (code == activeObject.code && name == activeObject.name && status == activeObject.status) {
            alert.type = "alert-warning";
            alert.message = String(name).toUpperCase() + " was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (code != "" && name != "" && status != "") {
            popup.type = "branchEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            const aux01 = String(code);
            const aux02 = String(name).toUpperCase()
            var count = 0;
            if (code != activeObject.code){
                count += Branches.find({
                    code: aux01,
                }).count()
            };
            if (name != activeObject.name){
                count += Branches.find({
                    name: aux02,
                }).count()
            };
            popupAux.old = count;
            popupAux.param1 = code;
            popupAux.param2 = name;
            popupAux.param3 = status;
            Modal.show('popup');
        };
    },
});
