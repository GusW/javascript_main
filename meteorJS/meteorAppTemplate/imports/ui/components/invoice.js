import {
    Invoices
} from '../../api/invoices.js';
import {
    Carriers
} from '../../api/carriers.js';
import {
    Branches
} from '../../api/branches.js';
import './invoice.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

const objectName = "Invoice";

var object = {
    name: objectName,
    menu: "Settings",
    title: "Manage " + objectName,
    new: "InvoiceNew",
    titleNew: "Create " + objectName,
    edit: "InvoiceEdit",
    titleEdit: "Edit " + objectName,
    carrier: "Carrier",
    inputCarrier: "inputCarrier",
    dueDate: "Month/Year",
    inputDate: "inputDate",
    value: "Value",
    inputValue: "inputValue",
    phone: "Phone Number",
    inputPhone: "inputPhone",
    branch: "Branch",
    inputBranch: "inputBranch",
    status: "Status",
    inputStatus: "inputStatus",
};

var activeObject = {
    carrier: "",
    date: "",
    phone: "",
    value: "",
    branch: "",
    status: "",
};

var dtData = function() {
    return Invoices.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputDate = "#" + object.inputDate;
const inputPhone = "#" + object.inputPhone;
const inputValue = "#" + object.inputValue;
const inputBranch = "#" + object.inputBranch;
const inputStatus = "#" + object.inputStatus;

function oldObject(carrier, date, phone, branch) {
    return Invoices.find({
        carrier: carrier,
        date: date,
        phone: phone,
        branch: branch,
    }).count();
};

////////////////////////////////////////////////////////////////////////////////

function renderEditObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "AUDIT"){
        return null;
    }
    return "<a href='#' id='" + currentRow._id + "' data-page='InvoiceEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>";
};

function renderRemoveObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "AUDIT"){
        return null;
    }
    return "<a href='#' id='" + currentRow._id + "' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>";
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
        title: 'Date',
        data: 'date',
        className: 'floatCenter',
    }, {
        title: 'Phone',
        data: 'phone',
        className: 'floatCenter',
    }, {
        title: 'Value',
        data: 'value',
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
        render: renderEditObject,
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderRemoveObject,
    }, ],
    "columnDefs": [{
        "width": "20%",
        "targets": 0
    }, {
        "width": "35%",
        "targets": 1
    }, {
        "width": "10%",
        "targets": 2
    }, {
        "width": "10%",
        "targets": 3
    }, {
        "width": "10%",
        "targets": 4
    }, {
        "width": "10%",
        "targets": 5
    }, {
        "width": "0.1%",
        "targets": 6
    }, {
        "width": "0.1%",
        "targets": 7
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

Template.Invoice.created = function() {
    Meteor.subscribe("invoices");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
};

Template.Invoice.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
    $(inputDate).inputmask("99/2099", {
        placeholder: " "
    });
    $(inputPhone).inputmask("(99) 9999-9999", {
        placeholder: " ",
        skipOptionalPartCharacter: " ",
    });
    $(inputValue).inputmask("currency", {
        radixPoint: ".",
        prefix: "$ ",
        numericInput: true,
    });
    const input01 = document.getElementById('inputDate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputValue');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputPhone');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputBranch');
    input04.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/YYYY',
        });
    });
};

Template.Invoice.helpers({
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
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
            }, ]
        };
    },
    hasAccessProfile: function(){
        let access = true;
        if (Meteor.user().profile.access === "AUDIT"){
            access = false;
        };
        return access;
    },
});

Template.Invoice.events({
    'click #btnNew': function(event) {
        const ref = object.new;
        Session.set('activeModal', ref);
    },
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click .js-edit': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const invoice = Invoices.findOne(id);
        const carrier = Carriers.findOne(invoice.carrier);
        const branch = Branches.findOne(invoice.branch);
        activeObject = {
            carrier: carrier.carrier,
            date: invoice.date,
            phone: invoice.phone,
            value: invoice.value,
            branch: branch.codeName,
            status: invoice.status,
        };
        Session.set('activeModal', href);
    },
    'click .js-remove': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        const invoice = Invoices.findOne(id);
        popup.type = "invoiceDel";
        popup.title = "Remove " + objectName;
        popup.message = "Do you really wish to remove the register?";
        popup.no = "Cancel";
        popup.yes = "Yes, remove";
        popup.popupId = id;
        Modal.show('popup');
    },
    'submit form': function(event) {
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const date = $(inputDate).val();
        const phone = $(inputPhone).val();
        const value = $(inputValue).val();
        const branch = $(inputBranch).val();
        const status = $(inputStatus).val();
        const invoices = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < invoices.length; i++) {
            var object = invoices[i];
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
            if (date != "") {
                if (object.date == date) {
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
            if (value != "") {
                if (object.value == value) {
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
        const date = $(inputDate).val();
        const phone = $(inputPhone).val();
        const value = $(inputValue).val();
        const branch = $(inputBranch).val();
        const status = $(inputStatus).val();
        const invoices = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
            Carrier: "Carrier",
            Branch: "Branch",
            Date: "Date",
            Phone: "Phone",
            Value: "Value",
            Status: "Status",
        };
        exportList.push(obj);
        for (var i = 0; i < invoices.length; i++) {
            var criteria = true;
            var object = invoices[i];
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
            if (date != "") {
                if (object.date == date) {
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
            if (value != "") {
                if (object.value == value) {
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
            if (criteria) {
                obj = {
                    Carrier: (Carriers.findOne(object.carrier)).carrier,
                    Branch: (Branches.findOne(object.branch)).codeName,
                    Date: object.date,
                    Phone: object.phone,
                    Value: object.value,
                    Status: object.status,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Invoices");
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

Template.InvoiceNew.created = function() {
    Meteor.subscribe("invoices");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
};

Template.InvoiceNew.rendered = function() {
    $(".alert").hide();
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleNew).addClass("active");
    $(inputDate).inputmask("99/2099", {
        placeholder: " "
    });
    $(inputPhone).inputmask("(99) 9999-9999", {
        placeholder: " "
    });
    $(inputValue).inputmask("currency", {
        radixPoint: ".",
        prefix: "$ ",
        numericInput: true,
    });
    const input01 = document.getElementById('inputDate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputValue');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputPhone');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputBranch');
    input04.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/YYYY',
        });
    });
};

Template.InvoiceNew.helpers({
    object: object,
    carriers() {
        return Carriers.find({
          status:"ACTIVE"
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
                filter: { status : "ACTIVE" },
            }, ]
        };
    },
});

Template.InvoiceNew.events({
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const date = $(inputDate).val();
        const phone = $(inputPhone).val();
        const value = $(inputValue).val();
        const branch = $(inputBranch).val();
        popup.back = objectName;
        if (carrier != "" || date != "" || phone != "" || value != "" || branch != "") {
            popup.type = "invoiceNew_Back";
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
        const date = $(inputDate).val();
        const phone = $(inputPhone).val();
        const value = $(inputValue).val();
        const branch = $(inputBranch).val();
        if (carrier != "" && date != "" && value != "" && branch != "") {
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
            popup.type = "invoiceNew_Save";
            popup.title = "Save new " + objectName;
            popup.message = "Do you really wish to save this new " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, save";
            popupAux.old = (oldObject(carrier, date, phone, branch));
            popupAux.param1 = carrierAux._id;
            popupAux.param2 = date;
            popupAux.param3 = phone;
            popupAux.param4 = value;
            popupAux.param5 = branchAux._id;
            Modal.show('popup');
        } else if (carrier != "" && date != "" && value == 0 && branch != "") {
            alert.type = "alert-danger";
            alert.message = "Invoice value can NOT be zero ($0.00). Please revise and try again.";
            showHideAlert(alertClass);
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.InvoiceEdit.created = function() {
    Meteor.subscribe("carriers");
};

Template.InvoiceEdit.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputStatus).val(activeObject.status);
    $(inputDate).inputmask("99/2099", {
        placeholder: " "
    });
    $(inputPhone).inputmask("(99) 9999-9999", {
        placeholder: " "
    });
    $(inputValue).inputmask("currency", {
        radixPoint: ".",
        prefix: "$ "
    });
    $(inputCarrier).val(activeObject.carrier);
    const input01 = document.getElementById('inputBranch');
    input01.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/YYYY',
        });
    });
};

Template.InvoiceEdit.helpers({
    object: object,
    statuses: statuses,
    activeObject() {
        return activeObject
    },
    carriers() {
        return Carriers.find({
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
                filter : { status : "ACTIVE"}
            }, ]
        };
    },
});

Template.InvoiceEdit.events({
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click #btnCancel': function(event) {
        const carrier = $(inputCarrier).val();
        const date = $(inputDate).val();
        const phone = $(inputPhone).val();
        const value = $(inputValue).val();
        const branch = $(inputBranch).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        if (carrier != activeObject.carrier || date != activeObject.date || phone != activeObject.phone || value != activeObject.value || branch != activeObject.branch || status != activeObject.status) {
            popup.type = "invoiceEdit_Back";
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
        const carrier = String($(inputCarrier).val());
        const date = String($(inputDate).val());
        const phone = $(inputPhone).val();
        const value = $(inputValue).val();
        const branch = $(inputBranch).val();
        const status = $(inputStatus).val();
        if (carrier == activeObject.carrier && date == activeObject.date && phone == activeObject.phone && value == activeObject.value && branch == activeObject.branch && status == activeObject.status) {
            alert.type = "alert-warning";
            alert.message = "The Invoice was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (carrier != "" && date != "" && value != "" && branch != "" && status != ""){
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
            popup.type = "invoiceEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            var count = 0;
            if (carrier != activeObject.carrier || phone != activeObject.phone || date != activeObject.date || branch != activeObject.branch){
                count += oldObject(carrierAux._id, date, phone, branchAux._id);
            };
            popupAux.old = count;
            popupAux.param1 = carrierAux._id;
            popupAux.param2 = date;
            popupAux.param3 = phone;
            popupAux.param4 = value;
            popupAux.param5 = branchAux._id;
            popupAux.param6 = status;
            Modal.show('popup');
        };
    },
});
