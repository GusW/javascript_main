import {
    Carriers
} from '../../api/carriers.js';
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
import './carrier.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';
import '../layout/autocomplete.js';
import '../layout/header.js';
import '../localization.js';
import '../function.js';

const objectName = "Carrier";

var object = {
    name: objectName,
    menu: "Settings",
    title: "Manage " + objectName,
    new: "carrierNew",
    titleNew: "Create " + objectName,
    edit: "carrierEdit",
    titleEdit: "Edit " + objectName,
    carrier: "Name",
    inputCarrier: "inputCarrier",
    status: "Status",
    inputStatus: "inputStatus",
};

var activeObject = {
    carrier: "",
    status: "",
};

var dtData = function(){
  return Carriers.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputStatus = "#" + object.inputStatus;

////////////////////////////////////////////////////////////////////////////////

function renderEditObject(currentRow){
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN"){
        return "<a href='#' id='" + currentRow._id + "' data-page='CarrierEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>"
    }
    return null;
};

function renderRemoveObject(currentRow){
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN"){
        const circulars = Circulars.find({"carrier":currentRow._id}).count();
        const incidents = Incidents.find({"carrier":currentRow._id}).count();
        const invoices = Invoices.find({"carrier":currentRow._id}).count();
        const reports = Reports.find({"carrier":currentRow._id}).count();
        const total = circulars + incidents + invoices + reports;
        if (total === 0){
            return "<a href='#' id='" + currentRow._id + "' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>";
        }
    };
    return null;
};

const dtOptions = {
    columns: [{
        title: 'Name',
        data: 'carrier',
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
    "columnDefs": [  {
        "width": "10%",
        "targets": 1
    },{
        "width": "0.1%",
        "targets": 2
    }, {
        "width": "0.1%",
        "targets": 3
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

Template.Carrier.created = function(){
  Meteor.subscribe("carriers");
  Meteor.subscribe("invoices");
};

Template.Carrier.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width","auto");
    const input01 = document.getElementById('inputCarrier');
    input01.autocomplete = 'off';
    $(inputCarrier).inputmask({
      mask:"[A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}]",
      definitions: {
          'A': {
            validator: "[A-Za-z0-9&]",
            casing: "upper"
          },
          '_': {
            validator: "[ ]",
          },
      },
      placeholder: "",
    });
};

Template.Carrier.helpers({
    object: object,
    statuses: statuses,
    carriers() {
        return Carriers.find({}, {
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
                collection: Carriers,
                field: "carrier",
                template: Template.ac_carrier,
                matchAll: true,
            }, ]
        };
    },
    hasAccessProfile: function(){
        let access = false;
        if (Meteor.user().profile.access === "ADMIN"){
            access = true;
        };
        return access;
    },
});

Template.Carrier.events({
    'click #btnNew': function(event) {
        const ref = object.new;
        Session.set('activeModal', ref);
    },
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click .js-remove': function(e, t){
        e.preventDefault();
        const id = $(e.target).attr('id');
        const carrier = Carriers.findOne(id);
        popup.type = "carrierDel";
        popup.title = "Remove " + objectName;
        popup.message = "Do you really wish to remove " + carrier.carrier + "?";
        popup.no = "Cancel";
        popup.yes = "Yes, remove";
        popup.popupId = id;
        Modal.show('popup');
    },
    'click .js-edit': function(e, t){
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const carrier = Carriers.findOne(id);
        activeObject = {
          carrier:carrier.carrier,
          status:carrier.status,
        }
        Session.set('activeModal',href);
    },
    'submit form': function(event){
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const status = $(inputStatus).val();
        const carriers = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i<carriers.length; i++){
            var object = carriers[i];
            var criteria = true;
            if (carrier != ""){
                if (object.carrier.toUpperCase().includes(carrier.toUpperCase())){
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
        const carrier = $(inputCarrier).val();
        const status = $(inputStatus).val();
        const carriers = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
          Name:"Name",
          Status:"Status",
        };
        exportList.push(obj);
        for (var i = 0; i < carriers.length; i++){
            var criteria = true;
            var object = carriers[i];
            if (carrier != "") {
                if (object.carrier.toUpperCase().includes(carrier.toUpperCase())) {
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
                    Name: object.carrier,
                    Status: object.status,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Carriers");
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

Template.CarrierNew.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleNew).addClass("active");
    const input01 = document.getElementById('inputCarrier');
    input01.autocomplete = 'off';
    $(inputCarrier).inputmask({
      mask:"[A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}][A{*}_{1}]",
      definitions: {
          'A': {
            validator: "[A-Za-z0-9&]",
            casing: "upper"
          },
          '_': {
            validator: "[ ]",
          },
      },
      placeholder: "",
    });
};

Template.CarrierNew.helpers({
    object: object,
});

Template.CarrierNew.events({
    'click #btnClear': function(event) {
        form.reset();
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        popup.back = objectName;
        if (carrier != "") {
            popup.type = "carrierNew_Back";
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
        const carrier = $(inputCarrier).val();
        if (carrier != "") {
            popup.type = "carrierNew_Save";
            popup.title = "Save new " + objectName;
            popup.message = "Do you really wish to save this new " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, save";
            const aux1 = String(carrier).toUpperCase();
            popupAux.old = Carriers.find({
                carrier: aux1,
            }).count();
            popupAux.param1 = carrier;
            Modal.show('popup');
        };
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.CarrierEdit.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputStatus).val(activeObject.status);
    const input01 = document.getElementById('inputCarrier');
    input01.autocomplete = 'off';
};

Template.CarrierEdit.helpers({
    object: object,
    statuses: statuses,
    activeObject() {
        return activeObject
    },
});

Template.CarrierEdit.events({
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        if (carrier != activeObject.carrier || status != activeObject.status) {
            popup.type = "carrierEdit_Back";
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
        const carrier = $(inputCarrier).val();
        const status = $(inputStatus).val();
        if(carrier == activeObject.carrier && status == activeObject.status){
            alert.type = "alert-warning";
            alert.message = String(carrier).toUpperCase() + " was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (carrier != "" && status != "") {
            popup.type = "carrierEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            const aux1 = String(carrier).toUpperCase();
            var count = 0;
            if (carrier != activeObject.carrier){
                count += Carriers.find({
                    carrier: aux1,
                }).count()
            };
            popupAux.old = count;
            popupAux.param1 = carrier;
            popupAux.param2 = status;
            Modal.show('popup');
        };
    },
});
