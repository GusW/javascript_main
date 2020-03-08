import {
    Branches
} from '../../api/branches.js';
import {
    Carriers
} from '../../api/carriers.js';
import {
    Circulars
} from '../../api/circulars.js';
import './circular.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

const objectName = "Circular";

var object = {
    name: objectName,
    menu: "Circulars",
    title: "Manage " + objectName,
    new: "CircularNew",
    titleNew: "Create " + objectName,
    edit: "CircularEdit",
    titleEdit: "Edit " + objectName,
    carrier: "Carrier",
    inputCarrier: "inputCarrier",
    code: "Code",
    inputCode: "inputCode",
    number: "Number",
    inputNumber: "inputNumber",
    bundle: "Bundle",
    inputBundle: "inputBundle",
    type: "Type",
    inputType: "inputType",
    oDate: "Opening Date",
    inputODate: "inputODate",
    cDate: "Closing Date",
    inputCDate: "inputCDate",
    branch: "Branch",
    inputBranch: "inputBranch",
    status: "Status",
    inputStatus: "inputStatus",
    situation: "Situation",
    inputSituation: "inputSituation",
};

var activeObject = {
    carrier: "",
    code: "",
    number: "",
    bundle: "",
    type: "",
    oDate: "",
    cDate: "",
    situation: "",
    branch: "",
    status: "",
};

var dtData = function() {
    return Circulars.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputCode = "#" + object.inputCode;
const inputNumber = "#" + object.inputNumber;
const inputBundle = "#" + object.inputBundle;
const inputType = "#" + object.inputType;
const inputODate = "#" + object.inputODate;
const inputCDate = "#" + object.inputCDate;
const inputBranch = "#" + object.inputBranch;
const inputStatus = "#" + object.inputStatus;
const inputSituation = "#" + object.inputSituation;

function oldObject(code, number){
    return Circulars.find({
        code: code,
        number: number,
    }).count();
};

function getSituation(cDate){
  var situation = "";
  if (cDate != ""){
    situation = "CLOSED";
  } else {
    situation = "OPEN";
  };
  return situation;
};

///////////////////////////////////////////////////////////////////////////////////////

function renderEditObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN" || accessProfile === "REPORTS"){
        return "<a href='#' id='" + currentRow._id + "' data-page='CircularEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>"
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
        title: 'Bundle',
        data: 'bundle',
        className: 'floatCenter',
    }, {
        title: 'Type',
        data: 'type',
        className: '',
    }, {
        title: 'Code',
        data: 'code',
        className: 'floatCenter',
    }, {
        title: 'Number',
        data: 'number',
        className: 'floatCenter',
    }, {
        title: 'Situation',
        data: function(row) {
            const cDate = row.cDate;
            return getSituation(cDate);
        },
        className: 'floatCenter',
    },  {
        title: 'Opening',
        data: 'oDate',
        className: 'floatCenter',
    }, {
        title: 'Closing',
        data: 'cDate',
        className: 'floatCenter',
    },{
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
    "columnDefs": [{
        "width": "10%",
        "targets": 0
    },{
        "width": "20%",
        "targets": 1
    },{
        "width": "7%",
        "targets": 2
    },{
        "width": "15%",
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
    },{
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

Template.Circular.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("circulars");
};

Template.Circular.rendered = function() {
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
    $(inputCode).inputmask("99999", {
        placeholder: " ",
    });
    $(inputNumber).inputmask("9999/2099", {
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

Template.Circular.helpers({
    object: object,
    statuses: statuses,
    situations: situations,
    bundles: bundles,
    circularTypes: circularTypes,
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

Template.Circular.events({
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
        const report = Circulars.findOne(id);
        popup.type = "circularDel";
        popup.title = "Remove " + objectName;
        popup.message = "Do you really wish to remove the register?";
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
        const circular = Circulars.findOne(id);
        const carrier = Carriers.findOne(circular.carrier);
        const branch = Branches.findOne(circular.branch);
        const situation = getSituation(circular.cDate);
        activeObject = {
            carrier: carrier.carrier,
            code: circular.code,
            number: circular.number,
            bundle: circular.bundle,
            type: circular.type,
            oDate: circular.oDate,
            cDate: circular.cDate,
            situation: situation,
            branch: branch.codeName,
            status: circular.status,
        };
        Session.set('activeModal', href);
    },
    'submit form': function(event){
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const branch = $(inputBranch).val();
        const code = $(inputCode).val();
        const number = $(inputNumber).val();
        const bundle = $(inputBundle).val();
        const type = $(inputType).val();
        const oDate = $(inputODate).val();
        const cDate = $(inputCDate).val();
        const situation = $(inputSituation).val();
        const status = $(inputStatus).val();
        const circulars = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < circulars.length; i++) {
            var object = circulars[i];
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
            if (code != "") {
                if (object.code == code) {
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
            if (bundle != "") {
                if (object.bundle == bundle) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (type != "") {
                if (object.type == type) {
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
            if (cDate != ""){
                if (new Date(object.cDate) <= new Date(cDate)) {
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
        const code = $(inputCode).val();
        const number = $(inputNumber).val();
        const bundle = $(inputBundle).val();
        const type = $(inputType).val();
        const oDate = $(inputODate).val();
        const cDate = $(inputCDate).val();
        const situation = $(inputSituation).val();
        const status = $(inputStatus).val();
        const circulars = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
            carrier: "carrier",
            Branch: "Branch",
            Code: "Code",
            Number: "Number",
            Bundle: "Bundle",
            Type: "Type",
            Opening: "Opening Date",
            Closing: "Closing Date",
            Situation: "Situation",
            Status: "Status",
        };
        exportList.push(obj);
        for (var i = 0; i < circulars.length; i++) {
            var object = circulars[i];
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
            if (code != "") {
                if (object.code == code) {
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
            if (bundle != "") {
                if (object.bundle == bundle) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (type != "") {
                if (object.type == type) {
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
            if (cDate != ""){
                if (new Date(object.cDate) <= new Date(cDate)) {
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
                    Code: object.code,
                    Number: object.number,
                    Bundle: object.bundle,
                    Type: object.type,
                    Opening: object.oDate,
                    Closing: object.cDate,
                    Situation: getSituation(object.cDate),
                    Status: object.status,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Circulars");
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

Template.CircularNew.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
};

Template.CircularNew.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleNew).addClass("active");
    $(inputODate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCode).inputmask("99999", {
        placeholder: " ",
    });
    $(inputNumber).inputmask("9999/2099", {
        placeholder: " ",
    });
    const input01 = document.getElementById('inputODate');
    input01.autocomplete = 'off';
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

Template.CircularNew.helpers({
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
    bundles:bundles,
    circularTypes:circularTypes,
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

Template.CircularNew.events({
    'click #btnClear': function(event) {
        $(".reset").val("");
        return false;
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const code = $(inputCode).val();
        const number = $(inputNumber).val();
        const bundle = $(inputBundle).val();
        const type = $(inputType).val();
        const oDate = $(inputODate).val();
        const branch = $(inputBranch).val();
        popup.back = objectName;
        if (carrier != "" || code != "" || number != "" || bundle != "" || type != "" || oDate != "" || branch != "" ) {
            popup.type = "circularNew_Back";
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
      const code = $(inputCode).val();
      const number = $(inputNumber).val();
      const bundle = $(inputBundle).val();
      const type = $(inputType).val();
      const oDate = $(inputODate).val();
      const branch = $(inputBranch).val();
      if (carrier != "" || code != "" || number != "" || bundle != "" || type != "" || oDate != "" || branch != "" ) {
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
          popup.type = "circularNew_Save";
          popup.title = "Save new " + objectName;
          popup.message = "Do you really wish to save this new " + objectName + "?";
          popup.no = "Cancel";
          popup.yes = "Yes, save";
          popupAux.old = oldObject(code, number);
          popupAux.param1 = carrierAux._id;
          popupAux.param2 = branchAux._id;
          popupAux.param3 = code;
          popupAux.param4 = number;
          popupAux.param5 = bundle;
          popupAux.param6 = type;
          popupAux.param7 = oDate;
          Modal.show('popup');
      };
    },
});

///////////////////////////////////////////////////////////////////////////////////////

Template.CircularEdit.created = function() {
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
};

Template.CircularEdit.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputODate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCDate).inputmask("99/99/2099", {
        placeholder: " "
    });
    $(inputCode).inputmask("99999", {
        placeholder: " ",
    });
    $(inputNumber).inputmask("9999/2099", {
        placeholder: " ",
    });
    $(inputCarrier).val(activeObject.carrier);
    $(inputStatus).val(activeObject.status);
    $(inputBundle).val(activeObject.bundle);
    $(inputType).val(activeObject.type);
    const input01 = document.getElementById('inputODate');
    input01.autocomplete = 'off';
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

Template.CircularEdit.helpers({
    object: object,
    statuses:statuses,
    situations:situations,
    bundles:bundles,
    circularTypes: circularTypes,
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

Template.CircularEdit.events({
    'click #btnClear': function(event) {
        $(".reset").val("");
        return false;
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const branch = $(inputBranch).val();
        const code = $(inputCode).val();
        const number = $(inputNumber).val();
        const bundle = $(inputBundle).val();
        const type = $(inputType).val();
        const oDate = $(inputODate).val();
        const cDate = $(inputCDate).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        if (carrier != activeObject.carrier || branch != activeObject.branch || code != activeObject.code || number != activeObject.number || bundle != activeObject.bundle || oDate != activeObject.oDate || cDate != activeObject.cDate || status != activeObject.status ) {
            popup.type = "circularEdit_Back";
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
      const branch = $(inputBranch).val();
      const code = $(inputCode).val();
      const number = $(inputNumber).val();
      const bundle = $(inputBundle).val();
      const type = $(inputType).val();
      const oDate = $(inputODate).val();
      const cDate = $(inputCDate).val();
      const status = $(inputStatus).val();
        if (carrier == activeObject.carrier && branch == activeObject.branch && code == activeObject.code && number == activeObject.number && bundle == activeObject.bundle && type == activeObject.type && oDate == activeObject.oDate && cDate == activeObject.cDate && status == activeObject.status ) {
            alert.type = "alert-warning";
            alert.message = "The Circular was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (carrier != "" && oDate != "" && code != "" && branch != "" && status != "" && number != "" && bundle != ""  && type != "") {
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
            popup.type = "circularEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            var count = 0;
            if (code != activeObject.code || number != activeObject.number){
                count += oldObject(code, number);
            };
            popupAux.old = count;
            popupAux.param1 = carrierAux._id;
            popupAux.param2 = branchAux._id;
            popupAux.param3 = code;
            popupAux.param4 = number;
            popupAux.param5 = bundle;
            popupAux.param6 = type;
            popupAux.param7 = oDate;
            popupAux.param8 = cDate;
            popupAux.param9 = status;
            Modal.show('popup');
        };
    },
});
