import {
    Branches
} from '../../api/branches.js';
import {
    Carriers
} from '../../api/carriers.js';
import {
    Reports
} from '../../api/reports.js';
import './report.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

const objectName = "Report";

var object = {
    name: objectName,
    menu: "Reports",
    title: "Manage " + objectName,
    new: "ReportNew",
    titleNew: "Create " + objectName,
    view: "ReportView",
    titleView: "View " + objectName,
    edit: "ReportEdit",
    titleEdit: "Edit " + objectName,
    carrier: "Carrier",
    inputCarrier: "inputCarrier",
    oDate: "Opening Date",
    inputODate: "inputODate",
    dDate: "Due Date",
    inputDDate: "inputDDate",
    cDate: "Closing Date",
    inputCDate: "inputCDate",
    repTitle: "Title",
    inputRepTitle: "inputTitle",
    description: "Description",
    inputDescription: "inputDescription",
    branch: "Branch",
    inputBranch: "inputBranch",
    status: "Status",
    inputStatus: "inputStatus",
    situation: "Situation",
    inputSituation: "inputSituation",
};

var activeObject = {
    carrier: "",
    oDate: "",
    dDate: "",
    cDate: "",
    title: "",
    description: "",
    situation: "",
    branch: "",
    status: "",
};

var dtData = function() {
    return Reports.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputODate = "#" + object.inputODate;
const inputDDate = "#" + object.inputDDate;
const inputCDate = "#" + object.inputCDate;
const inputBranch = "#" + object.inputBranch;
const inputRepTitle = "#" + object.inputRepTitle;
const inputDescription = "#" + object.inputDescription;
const inputStatus = "#" + object.inputStatus;
const inputSituation = "#" + object.inputSituation;

function oldObject(carrier, branch, oDate, dDate, title){
    return Reports.find({
        carrier: carrier,
        branch: branch,
        oDate: oDate,
        dDate: dDate,
        title: title,
    }).count();
};

function getSituation(dDate, cDate){
  const today = moment(new Date()).format('MM/DD/YYYY');
  var situation = "";
  if (cDate != ""){
    situation = "CLOSED";
  } else if (today > dDate){
    situation = "DELAYED";
  } else {
    situation = "OPEN";
  }
  return situation;
};

///////////////////////////////////////////////////////////////////////////////////////

function renderViewObject(currentRow) {
    return "<a href='#' id='" + currentRow._id + "' data-page='ReportView' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>"
};

function renderEditObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN" || accessProfile === "REPORTS"){
      return "<a href='#' id='" + currentRow._id + "' data-page='ReportEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>"
    }
    return null;
};

function renderRemoveObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN" || accessProfile === "REPORTS"){
        return "<a href='#' id='" + currentRow._id + "' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>";
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
        title: 'Title',
        data: 'title',
        className: '',
    }, {
        title: 'Opening',
        data: 'oDate',
        className: 'floatCenter',
    }, {
        title: 'Due',
        data: 'dDate',
        className: 'floatCenter',
    }, {
        title: 'Closing',
        data: 'cDate',
        className: 'floatCenter',
    }, {
        title: 'Situation',
        data: function(row) {
            const dDate = row.dDate;
            const cDate = row.cDate;
            return getSituation(dDate, cDate);
        },
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
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderRemoveObject,
    }, ],
    "columnDefs": [{
        "width": "10%",
        "targets": 0
    },{
        "width": "25%",
        "targets": 1
    },{
        "width": "25%",
        "targets": 2
    },{
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
        "width": "0.1%",
        "targets": 8
    }, {
        "width": "0.1%",
        "targets": 9
    }, {
        "width": "0.1%",
        "targets": 10
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

Template.Report.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("reports");
};

Template.Report.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
    $(inputODate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputDDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    const input01 = document.getElementById('inputODate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputDDate');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputCDate');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputBranch');
    input04.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/DD/YYYY',
        });
    });
};

Template.Report.helpers({
    object: object,
    statuses: statuses,
    situations: situations,
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
    hasAccessProfile: function(){
        let access = false;
        const accessProfile = Meteor.user().profile.access;
        if (accessProfile === "ADMIN" || accessProfile === "REPORTS"){
            access =  true;
        }
        return access;
    },
});

Template.Report.events({
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
        popup.type = "reportDel";
        popup.title = "Remove " + objectName;
        popup.message = "Do you really wish to remove the register?";
        popup.no = "Cancel";
        popup.yes = "Yes, remove";
        popup.popupId = id;
        Modal.show('popup');
    },
    'click .js-view': function(e, t){
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const report = Reports.findOne(id);
        const carrier = Carriers.findOne(report.carrier);
        const branch = Branches.findOne(report.branch);
        const situation = getSituation(report.dDate, report.cDate);
        activeObject = {
            carrier: carrier.carrier,
            oDate: report.oDate,
            dDate: report.dDate,
            cDate: report.cDate,
            title: report.title,
            description:report.description,
            situation: situation,
            branch: branch.codeName,
            status: report.status,
        };
        Session.set('activeModal', href);
    },
    'click .js-edit': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const report = Reports.findOne(id);
        const carrier = Carriers.findOne(report.carrier);
        const branch = Branches.findOne(report.branch);
        const situation = getSituation(report.dDate, report.cDate);
        activeObject = {
            carrier: carrier.carrier,
            oDate: report.oDate,
            dDate: report.dDate,
            cDate: report.cDate,
            title: report.title,
            description:report.description,
            situation: situation,
            branch: branch.codeName,
            status: report.status,
        };
        Session.set('activeModal', href);
    },
    'submit form': function(event){
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const branch = $(inputBranch).val();
        const oDate = $(inputODate).val();
        const dDate = $(inputDDate).val();
        const cDate = $(inputCDate).val();
        const title = $(inputRepTitle).val();
        const description = $(inputDescription).val();
        const situation = $(inputSituation).val();
        const status = $(inputStatus).val();
        const reports = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < reports.length; i++) {
            var object = reports[i];
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
            if (oDate != ""){
                if (object.oDate >= oDate) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (dDate != ""){
                if (new Date(object.dDate) <= new Date(dDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (cDate != ""){
                if (new Date(object.cDate) == new Date(cDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (title != ""){
                if (object.title.toUpperCase().includes(title.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (description != ""){
                if (object.description.toUpperCase().includes(description.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (situation != "") {
                const objectSit = getSituation(object.dDate, object.cDate);
                if (objectSit == situation) {
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
    'click #btnExport': function(event) {
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const branch = $(inputBranch).val();
        const oDate = $(inputODate).val();
        const dDate = $(inputDDate).val();
        const cDate = $(inputCDate).val();
        const title = $(inputRepTitle).val();
        const description = $(inputDescription).val();
        const situation = $(inputSituation).val();
        const status = $(inputStatus).val();
        const reports = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
            carrier: "carrier",
            Branch: "Branch",
            Title: "Title",
            Opening: "Opening Date",
            Due: "Due Date",
            Closing: "Closing Date",
            Situation: "Situation",
            Status: "Status",
            Description: "Description",
        };
        exportList.push(obj);
        for (var i = 0; i < reports.length; i++) {
            var object = reports[i];
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
            if (oDate != ""){
                if (new Date(object.oDate) >= new Date(oDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (dDate != ""){
                if (new Date(object.dDate) <= new Date(dDate)) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (cDate != ""){
                if (object.cDate == cDate) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (title != ""){
                if (object.title.toUpperCase().includes(title.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (description != ""){
                if (object.description.toUpperCase().includes(description.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (situation != "") {
                const objectSit = getSituation(object.dDate, object.cDate);
                if (objectSit == situation) {
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
                    carrier: (Carriers.findOne(object.carrier)).carrier,
                    Branch: (Branches.findOne(object.branch)).codeName,
                    Title: object.title,
                    Opening: object.oDate,
                    Due: object.dDate,
                    Closing: object.cDate,
                    Situation: getSituation(object.dDate, object.cDate),
                    Status: object.status,
                    Description: object.description,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Reports");
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

Template.ReportNew.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
};

Template.ReportNew.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleNew).addClass("active");
    $(inputODate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputDDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    const input01 = document.getElementById('inputODate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputDDate');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputCDate');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputBranch');
    input04.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/DD/YYYY',
        });
    });
};

Template.ReportNew.helpers({
    object: object,
    carriers() {
        return Carriers.find({
            status: "ACTIVE"
        }, {
            sort: {
                carrier: 1
            }
        });
    },
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
                filter: {
                    status: "ACTIVE"
                },
            }, ]
        };
    },
});

Template.ReportNew.events({
    'click #btnClear': function(event) {
        $(".reset").val("");
        return false;
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const oDate = $(inputODate).val();
        const dDate = $(inputDDate).val();
        const branch = $(inputBranch).val();
        const title = $(inputRepTitle).val();
        const description = $(inputDescription).val();
        popup.back = objectName;
        if (carrier != "" || oDate != "" || dDate != "" || branch != "" || title != "" || description != "") {
            popup.type = "reportNew_Back";
            popup.title = "Exit without Saving";
            popup.message = "Do you really wish to quit without saving?";
            popup.no = "Cancel";
            popup.yes = "Yes, exit";
            popup.popupId = "";
            Modal.show('popup');
        } else {
            Session.set('activeModal', popup.back);
        };
        return false;
    },
    'submit form': function(event) {
      event.preventDefault();
      popup.back = objectName;
      const carrier = $(inputCarrier).val();
      const oDate = $(inputODate).val();
      const dDate = $(inputDDate).val();
      const branch = $(inputBranch).val();
      const title = $(inputRepTitle).val();
      const description = $(inputDescription).val();
      if (carrier != "" && oDate != "" && dDate != "" && branch != "" && title != "" && description != "") {
          const branchAux = Branches.findOne({
              "codeName": branch
          });
          if (!branchAux) {
              alert.type = "alert-warning";
              alert.message = "The typed Branch does NOT exist. You must pick an option from the autocomplete list.";
              showHideAlert(alertClass);
              return false;
          };
          const carrierAux = Carriers.findOne({
              "carrier": carrier
          });
          popup.type = "reportNew_Save";
          popup.title = "Save new " + objectName;
          popup.message = "Do you really wish to save this new " + objectName + "?";
          popup.no = "Cancel";
          popup.yes = "Yes, save";
          popupAux.old = oldObject(carrierAux._id, branchAux._id, oDate, dDate, title);
          popupAux.param1 = carrierAux._id;
          popupAux.param2 = branchAux._id;
          popupAux.param3 = oDate;
          popupAux.param4 = dDate;
          popupAux.param5 = title;
          popupAux.param6 = description;
          Modal.show('popup');
      };
    },
});

///////////////////////////////////////////////////////////////////////////////////////

Template.ReportView.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleView).addClass("active");
};

Template.ReportView.helpers({
    object: object,
    activeObject() {
        return activeObject
    },
});

Template.ReportView.events({
    'click #btnNew': function(event) {
        const ref = object.new;
        Session.set('activeModal', ref);
    },
    'click #btnBack': function(event) {
        const ref = objectName;
        Session.set('activeModal', ref);
    },
    'click #btnEdit': function(event) {
        const id = popup.popupId;
        const href = object.edit;
        const report = Reports.findOne(id);
        const carrier = Carriers.findOne(report.carrier);
        const branch = Branches.findOne(report.branch);
        const situation = getSituation(report.dDate, report.cDate);
        activeObject = {
            carrier: carrier.carrier,
            oDate: report.oDate,
            dDate: report.dDate,
            cDate: report.cDate,
            title: report.title,
            description:report.description,
            situation: situation,
            branch: branch.codeName,
            status: report.status,
        };
        Session.set('activeModal', href);
    },
});

///////////////////////////////////////////////////////////////////////////////////////

Template.ReportEdit.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
};

Template.ReportEdit.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputODate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputDDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCarrier).val(activeObject.carrier);
    $(inputStatus).val(activeObject.status);
    const input01 = document.getElementById('inputODate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputDDate');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputCDate');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputBranch');
    input04.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/DD/YYYY',
        });
    });
};

Template.ReportEdit.helpers({
    object: object,
    statuses:statuses,
    situations:situations,
    carriers() {
        return Carriers.find({
        }, {
            sort: {
                carrier: 1
            }
        });
    },
    reactiveDataFunction: function() {
        return dtData;
    },
    activeObject(){
      return activeObject;
    },
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
                filter: {
                    status: "ACTIVE"
                },
            }, ]
        };
    },
});

Template.ReportEdit.events({
    'click #btnClear': function(event) {
        $(".reset").val("");
        return false;
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const branch = $(inputBranch).val();
        const oDate = $(inputODate).val();
        const dDate = $(inputDDate).val();
        const cDate = $(inputCDate).val();
        const title = $(inputRepTitle).val();
        const description = $(inputDescription).val();
        const situation = $(inputSituation).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        if (carrier != activeObject.carrier || branch != activeObject.branch || oDate != activeObject.oDate || dDate != activeObject.dDate || cDate != activeObject.cDate || title != activeObject.title || description != activeObject.description || status != activeObject.status ) {
            popup.type = "reportEdit_Back";
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
      const oDate = $(inputODate).val();
      const dDate = $(inputDDate).val();
      const cDate = $(inputCDate).val();
      const branch = $(inputBranch).val();
      const status = $(inputStatus).val();
      const title = $(inputRepTitle).val();
      const description = $(inputDescription).val();
      if (carrier == activeObject.carrier && oDate == activeObject.oDate && dDate == activeObject.dDate && cDate == activeObject.cDate && branch == activeObject.branch && status == activeObject.status && title == activeObject.title && description == activeObject.description) {
            alert.type = "alert-warning";
            alert.message = "The Report was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (carrier != "" && oDate != "" && dDate != "" && branch != "" && status != "" && title != "" && description != "") {
            const carrierAux = Carriers.findOne({"carrier":carrier});
            const branchAux = Branches.findOne({"codeName":branch});
            if (carrier != activeObject.carrier && carrierAux.status != "ACTIVE"){
                alert.type = "alert-danger";
                alert.message = carrier + " is inactive therefore you can NOT use it. Please verify and try again.";
                showHideAlert(alertClass);
                return false;
            };
            if (branch != activeObject.branch){
                if (!branchAux) {
                    alert.type = "alert-warning";
                    alert.message = "The typed Branch does NOT exist. You must pick an option from the autocomplete list.";
                    showHideAlert(alertClass);
                    return false;
                } else if (branchAux && branchAux.status != "ACTIVE") {
                    alert.type = "alert-danger";
                    alert.message = branch + " is inactive therefore you can NOT use it. Please verify and try again.";
                    showHideAlert(alertClass);
                    return false;
                };
            };
            popup.type = "reportEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            let count = 0;
            if (carrier != activeObject.carrier || oDate != activeObject.oDate || dDate != activeObject.dDate || branch != activeObject.branch || title != activeObject.title){
                count += oldObject(carrierAux._id, branchAux._id, oDate, dDate, title);
            };
            popupAux.old = count;
            popupAux.param1 = carrierAux._id;
            popupAux.param2 = oDate;
            popupAux.param3 = dDate;
            popupAux.param4 = cDate;
            popupAux.param5 = branchAux._id;
            popupAux.param6 = title;
            popupAux.param7 = description;
            popupAux.param8 = status;
            Modal.show('popup');
        };
    },
});
