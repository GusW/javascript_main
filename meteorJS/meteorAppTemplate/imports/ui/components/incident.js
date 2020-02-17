import {
    Branches
} from '../../api/branches.js';
import {
    Carriers
} from '../../api/carriers.js';
import {
    Incidents
} from '../../api/incidents.js';
import {
    Invoices
} from '../../api/invoices.js';
import './incident.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

var dateFormat = require('dateformat');

const objectName = "Incident";

var object = {
    name: objectName,
    menu: "Incidents",
    title: "Manage " + objectName,
    view: "IncidentView",
    titleView: "View " + objectName,
    edit: "IncidentEdit",
    titleEdit: "Edit " + objectName,
    carrier: "Carrier",
    inputCarrier: "inputCarrier",
    phone: "Phone",
    inputPhone: "inputPhone",
    oDate: "Opening Date",
    inputODate: "inputODate",
    cDate: "Closing Date",
    inputCDate: "inputCDate",
    number: "Number",
    inputNumber: "inputNumber",
    contract: "Contract",
    inputContract: "inputContract",
    situation: "Situation",
    inputSituation: "inputSituation",
    responsibility: "Responsibility",
    inputResponsibility: "inputResponsibility",
    description: "Description",
    inputDescription: "inputDescription",
    branch: "Branch",
    inputBranch: "inputBranch",
    status: "Status",
    inputStatus: "inputStatus",
};

var activeObject = {
    carrier: "",
    phone: "",
    oDate: "",
    cDate: "",
    number: "",
    contract: "",
    situation: "",
    responsibility: "",
    description: "",
    branch: "",
    status: "",
};

var dtData = function() {
    return Incidents.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputPhone = "#" + object.inputPhone;
const inputODate = "#" + object.inputODate;
const inputCDate = "#" + object.inputCDate;
const inputNumber = "#" + object.inputNumber;
const inputContract = "#" + object.inputContract;
const inputSituation = "#" + object.inputSituation;
const inputResponsibility = "#" + object.inputResponsibility;
const inputBranch = "#" + object.inputBranch;
const inputStatus = "#" + object.inputStatus;
const inputDescription = "#" + object.inputDescription;

function oldObject(code, number) {
    return Incidents.find({
        code: code,
        number: number,
    }).count();
};

function getSituation(cDate) {
    var situation = "";
    if (cDate != "") {
        situation = "CLOSED";
    } else {
        situation = "OPEN";
    };
    return situation;
};

invoiceIncident = function(incidentId) {
    let result;
    const incident = Incidents.findOne({
        _id: incidentId
    });
    const carrier = incident.carrier;
    const branch = incident.branch;
    const phone = incident.phone;
    const date = dateFormat(incident.oDate, "mm/yyyy");
    const invoice = Invoices.findOne({
        carrier: carrier,
        branch: branch,
        date: date,
        phone: phone,
    });
    if (invoice != undefined) {
        result = invoice.value;
    } else {
        result = 0;
    }
    return result;
};

///////////////////////////////////////////////////////////////////////////////////////

function renderViewObject(currentRow) {
    return "<a href='#' id='" + currentRow._id + "' data-page='IncidentView' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>"
};

function renderEditObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN" || accessProfile === "INCIDENTS"){
        return "<a href='#' id='" + currentRow._id + "' data-page='IncidentEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>"
    }
    return null;
};

const dtOptions = {
    columns: [{
        title: 'Carrier',
        data: function(row) {
            const id = row.carrier;
            return (Carriers.findOne(id)).carrier;
        },
        className: '',
    }, {
        title: 'Branch',
        data: function(row) {
            const id = row.branch;
            return (Branches.findOne(id)).codeName;
        },
        className: '',
    }, {
        title: 'Phone',
        data: 'phone',
        className: 'floatCenter',
    }, {
        title: 'Contract',
        data: 'contract',
        className: 'floatCenter',
    }, {
        title: 'Number',
        data: 'number',
        className: '',
    }, {
        title: 'Opening',
        data: 'oDate',
        className: 'floatCenter',
    }, {
        title: 'Closing',
        data: 'cDate',
        className: 'floatCenter',
    }, {
        title: 'Situation',
        data: function(row) {
            const cDate = row.cDate;
            return getSituation(cDate);
        },
        className: 'floatCenter',
    }, {
        title: 'Responsibility',
        data: 'responsibility',
        className: 'floatCenter',
    }, {
        title: 'Status',
        data: 'status',
        className: 'floatCenter',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderViewObject,
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderEditObject,
    }, ],
    "columnDefs": [{
        "width": "10%",
        "targets": 0
    }, {
        "width": "25%",
        "targets": 1
    }, {
        "width": "10%",
        "targets": 2
    }, {
        "width": "7%",
        "targets": 3
    }, {
        "width": "7%",
        "targets": 4
    }, {
        "width": "7%",
        "targets": 5
    }, {
        "width": "7%",
        "targets": 6
    }, {
        "width": "7%",
        "targets": 7
    }, {
        "width": "7%",
        "targets": 8
    }, {
        "width": "7%",
        "targets": 9
    }, {
        "width": "0.1%",
        "targets": 10
    }, {
        "width": "0.1%",
        "targets": 11
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

Template.Incident.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("incidents");
    Meteor.subscribe("invoices");
};

Template.Incident.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
    $(inputODate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputPhone).inputmask("(99) 9999-9999", {
        placeholder: " ",
        skipOptionalPartCharacter: " ",
    });
    $(inputContract).inputmask("9999/2099", {
        placeholder: " ",
    });
    const input01 = document.getElementById('inputODate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputCDate');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputBranch');
    input03.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/DD/YYYY',
        });
    });
};

Template.Incident.helpers({
    object: object,
    statuses: statuses,
    situations: situations,
    responsibilities: responsibilities,
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
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
            }, ]
        };
    },
});

Template.Incident.events({
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click .js-view': function(e, t){
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const incident = Incidents.findOne(id);
        const carrier = Carriers.findOne(incident.carrier);
        const branch = Branches.findOne(incident.branch);
        const situation = getSituation(incident.cDate);
        activeObject = {
            carrier: carrier.carrier,
            phone: incident.phone,
            oDate: incident.oDate,
            cDate: incident.cDate,
            number: incident.number,
            contract: incident.contract,
            situation: situation,
            responsibility: incident.responsibility,
            description: incident.description,
            branch: branch.codeName,
            status: incident.status,
        };
        Session.set('activeModal', href);
    },
    'click .js-edit': function(e, t) {
      e.preventDefault();
      const id = $(e.target).attr('id');
      popup.popupId = id;
      const href = $(e.target).attr("data-page");
      const incident = Incidents.findOne(id);
      const carrier = Carriers.findOne(incident.carrier);
      const branch = Branches.findOne(incident.branch);
      const situation = getSituation(incident.cDate);
      activeObject = {
          carrier: carrier.carrier,
          phone: incident.phone,
          oDate: incident.oDate,
          cDate: incident.cDate,
          number: incident.number,
          contract: incident.contract,
          situation: situation,
          responsibility: incident.responsibility,
          description: incident.description,
          branch: branch.codeName,
          status: incident.status,
      };
      Session.set('activeModal', href);
    },
    'submit form': function(event) {
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const phone = $(inputPhone).val();
        const oDate = $(inputODate).val();
        const cDate = $(inputCDate).val();
        const number = $(inputNumber).val();
        const contract = $(inputContract).val();
        const situation = $(inputSituation).val();
        const responsibility = $(inputResponsibility).val();
        const branch = $(inputBranch).val();
        const status = $(inputStatus).val();
        const description = $(inputDescription).val();
        const incidents = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < incidents.length; i++) {
            var object = incidents[i];
            var criteria = true;
            if (carrier != "") {
                const carrierId = Carriers.findOne({
                    "carrier": carrier
                });
                if (object.carrier == carrierId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (phone != "") {
                if (object.phone == phone) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (oDate != "") {
                if (new Date(object.oDate) >= new Date(oDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (cDate != "") {
                if (new Date(object.cDate) <= new Date(cDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (number != "") {
                if (object.number == number) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (contract != "") {
                if (object.contract == contract) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (situation != "") {
                const objectSit = getSituation(object.cDate);
                if (objectSit == situation) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (responsibility != "") {
                if (object.responsibility == responsibility) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (branch != "") {
                const branchId = Branches.findOne({
                    "codeName": branch
                });
                if (object.branch == branchId._id) {
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
            if (description != "") {
                if (object.description.toUpperCase().includes(description.toUpperCase())) {
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
    'click #btnExport': function(event) {
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const phone = $(inputPhone).val();
        const oDate = $(inputODate).val();
        const cDate = $(inputCDate).val();
        const number = $(inputNumber).val();
        const contract = $(inputContract).val();
        const situation = $(inputSituation).val();
        const responsibility = $(inputResponsibility).val();
        const branch = $(inputBranch).val();
        const status = $(inputStatus).val();
        const description = $(inputDescription).val();
        const incidents = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
            Carrier: "Carrier",
            Branch: "Branch",
            Phone: "Phone",
            Contract: "Contract",
            Number: "Number",
            Opening: "Opening Date",
            Closing: "Closing Date",
            Situation: "Situation",
            Responsibility: "Responsibility",
            Description: "Description",
            Status: "Status",
        };
        exportList.push(obj);
        for (var i = 0; i < incidents.length; i++) {
            var object = incidents[i];
            var criteria = true;
            if (carrier != "") {
                const carrierId = Carriers.findOne({
                    "carrier": carrier
                });
                if (object.carrier == carrierId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (phone != "") {
                if (object.phone == phone) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (oDate != "") {
                if (new Date(object.oDate) >= new Date(oDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (cDate != "") {
                if (new Date(object.cDate) <= new Date(cDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (number != "") {
                if (object.number == number) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (contract != "") {
                if (object.contract == contract) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (situation != "") {
                const objectSit = getSituation(object.cDate);
                if (objectSit == situation) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (responsibility != "") {
                if (object.responsibility == responsibility) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (branch != "") {
                const branchId = Branches.findOne({
                    "codeName": branch
                });
                if (object.branch == branchId._id) {
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
            if (description != "") {
                if (object.description.toUpperCase().includes(description.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                obj = {
                      Carrier: (Carriers.findOne(object.carrier)).carrier,
                      Branch: (Branches.findOne(object.branch)).codeName,
                      Phone: object.phone,
                      Contract: object.contract,
                      Number: object.number,
                      Opening: object.oDate,
                      Closing: object.cDate,
                      Situation: getSituation(object.cDate),
                      Responsibility: object.responsibility,
                      Description: object.description,
                      Status: object.status,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Incidents");
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

///////////////////////////////////////////////////////////////////////////////////////

Template.IncidentView.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleView).addClass("active");
};

Template.IncidentView.helpers({
    object: object,
    activeObject() {
        return activeObject;
    },
    hasAccessProfile: function(){
        let access = false;
        if (Meteor.user().profile.access === "ADMIN" || Meteor.user().profile.access === "INCIDENTS"){
            access = true;
        };
        return access;
    },
});

Template.IncidentView.events({
    'click #btnBack': function(event) {
        Session.set('activeModal', objectName);
    },
    'click #btnEdit': function(event) {
        const id = popup.popupId;
        const href = object.edit;
        const incident = Incidents.findOne(id);
        const carrier = Carriers.findOne(incident.carrier);
        const branch = Branches.findOne(incident.branch);
        const situation = getSituation(incident.cDate);
        activeObject = {
            carrier: carrier.carrier,
            phone: incident.phone,
            oDate: incident.oDate,
            cDate: incident.cDate,
            number: incident.number,
            contract: incident.contract,
            situation: situation,
            responsibility: incident.responsibility,
            description: incident.description,
            branch: branch.codeName,
            status: incident.status,
        };
        Session.set('activeModal', href);
    },
});

///////////////////////////////////////////////////////////////////////////////////////

Template.IncidentEdit.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("incidents");
};

Template.IncidentEdit.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputStatus).val(activeObject.status);
    $(inputResponsibility).val(activeObject.responsibility);
    $(inputResponsibility).on('change', function() {
        var resp = $(inputResponsibility).val();
        if (resp != "CARRIER") {
            $("#incidentLabel").html(object.description + "<span class='required'>*</span>");
            $(inputDescription).prop('required',true);
        } else {
            $("#incidentLabel").html(object.description);
            $(inputDescription).prop('required',false);
        };
    });
    var resp = $(inputResponsibility).val();
    if (resp != "CARRIER") {
        $("#incidentLabel").html(object.description + "<span class='required'>*</span>");
        $(inputDescription).prop('required',true);
    };
};

Template.IncidentEdit.helpers({
    object: object,
    statuses: statuses,
    responsibilities: responsibilities,
    activeObject() {
        return activeObject;
    },
});

Template.IncidentEdit.events({
    'click #btnClear': function(event) {
        $(".reset").val("");
        return false;
    },
    'click #btnCancel': function(event) {
        const responsibility = $(inputResponsibility).val();
        const description = $(inputDescription).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        console.log(responsibility);
        console.log(activeObject.responsibility);
        console.log(description);
        console.log(activeObject.description);
        console.log(status);
        console.log(activeObject.status);
        if (responsibility != activeObject.responsibility || description != activeObject.description || status != activeObject.status) {
            popup.type = "incidentEdit_Back";
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
        const responsibility = $(inputResponsibility).val();
        const description = $(inputDescription).val();
        const status = $(inputStatus).val();
        if (responsibility == activeObject.responsibility && description == activeObject.description && status == activeObject.status) {
            alert.type = "alert-warning";
            alert.message = "The Incident was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (responsibility != "" && status != "") {
            popup.type = "incidentEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            popupAux.param1 = responsibility;
            popupAux.param2 = description;
            popupAux.param3 = status;
            Modal.show('popup');
        };
    },
});
