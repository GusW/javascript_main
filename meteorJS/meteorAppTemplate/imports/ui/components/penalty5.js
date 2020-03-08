import {
    Penalties5
} from '../../api/penalties5.js';
import {
    Branches
} from '../../api/branches.js';
import {
    Carriers
} from '../../api/carriers.js';
import {
    Invoices
} from '../../api/invoices.js';
import {
    Parameters
} from '../../api/parameters.js';
import {
    Reports
} from '../../api/reports.js';
import './penalty5.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';
import '../function.js';

var dateFormat = require('dateformat');
var numeral = require('numeral');

const objectName = "P5";

var object = {
    name: objectName,
    menu: "Penalties",
    title: "Elaborate " + objectName,
    new: "InvoiceNew",
    titleNew: "Create " + objectName,
    edit: "InvoiceEdit",
    titleEdit: "Edit " + objectName,
    carrier: "Carrier",
    inputCarrier: "inputCarrier",
    date: "Month/Year",
    inputDate: "inputDate",
    branch: "Branch",
    inputBranch: "inputBranch",
};

var dtData = function() {
    return Penalties5.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputDate = "#" + object.inputDate;
const inputBranch = "#" + object.inputBranch;

////////////////////////////////////////////////////////////////////////////////

function invoicesP5(report) {
    let invoices = [];
    let monthYear;
    const object = Reports.findOne({
        _id: report
    });
    const carrier = object.carrier;
    const branch = object.branch;
    const dDate = object.dDate;
    const cDate = object.cDate;
    const monthDDate = Number(dDate.substring(0, 2));
    const yearDDate = Number(dDate.substring(6, 10));
    const monthCDate = Number(cDate.substring(0, 2));
    const yearCDate = Number(cDate.substring(6, 10));
    if (yearDDate === yearCDate) {
        for (let i = 0; i <= (monthCDate - monthDDate); i++) {
            monthYear = String(monthToString(monthDDate + i) + "/" + yearDDate);
            invoices.push(monthYear);
        };
    } else {
        for (let ii = 0; ii <= (12 - monthDDate); ii++) {
            monthYear = String(monthToString(monthDDate + ii) + "/" + yearDDate);
            invoices.push(monthYear);
        };
        for (let iii = 1; iii <= monthCDate; iii++) {
            monthYear = String(monthToString(iii) + "/" + yearCDate);
            invoices.push(monthYear);
        };
    }
    return invoices;
};

function invoicesP5Amount(report){
    const invoices = invoicesP5(report);
    let invoice, invoiceDate, object;
    let amount = 0;
    for (let i = 0; i < invoices.length; i++){
        object = Reports.findOne(report);
        invoiceDate = invoices[i];
        invoice = Invoices.findOne({
            carrier: object.carrier,
            branch: object.branch,
            date: invoiceDate,
        });
        if (invoice !== "" && invoice !== undefined){
            amount++;
        }
    };
    return amount;
};

function invoicesP5Value(report){
    const invoices = invoicesP5(report);
    let invoice, invoiceDate, object;
    let total = 0;
    for (let i = 0; i < invoices.length; i++){
        object = Reports.findOne(report);
        invoiceDate = invoices[i];
        invoice = Invoices.findOne({
            carrier: object.carrier,
            branch: object.branch,
            date: invoiceDate,
        });
        if (invoice !== "" && invoice !== undefined){
            total += numeral().unformat(invoice.value);
        }
    };
    return total;
};


function p5(report){
    let penalty;
    const object = Reports.findOne({_id:report});
    const param = Parameters.findOne({penalty:"P5"});
    const carrierATT = Carriers.findOne({carrier:"AT&T"});
    const invoiceTotal = invoicesP5Value(report);
    if (object.carrier == carrierATT._id) {
        penalty = invoiceTotal * (param.factor03/100) + param.factor04;
    } else {
        penalty = invoiceTotal * (param.factor01/100) + param.factor02;
    }
    return penalty;
};

const dtOptions = {
    columns: [{
        title: 'Carrier',
        data: function(row) {
            const report = Reports.findOne(row.report);
            const carrier = Carriers.findOne(report.carrier);
            return carrier.carrier;
        },
        className: '',
    }, {
        title: 'Branch',
        data: function(row) {
            const report = Reports.findOne(row.report);
            const branch = Branches.findOne(report.branch);
            return branch.codeName;
        },
        className: '',
    }, {
        title: 'Title',
        data: function(row) {
            const report = Reports.findOne(row.report);
            return report.title;
        },
        className: '',
    }, {
        title: 'Opening',
        data: function(row) {
            const report = Reports.findOne(row.report);
            return report.oDate;
        },
        className: '',
    }, {
        title: 'Due Date',
        data: function(row) {
            const report = Reports.findOne(row.report);
            return report.dDate;
        },
        className: '',
    }, {
        title: 'Closing',
        data: function(row) {
            const report = Reports.findOne(row.report);
            return report.cDate;
        },
        className: '',
    }, {
        title: 'Months',
        data: function(row) {
            let result;
            const report = Reports.findOne(row.report);
            const monthDDate = Number(report.dDate.substring(0, 2));
            const yearDDate = Number(report.dDate.substring(6, 10));
            const monthCDate = Number(report.cDate.substring(0, 2));
            const yearCDate = Number(report.cDate.substring(6, 10));
            if (yearDDate === yearCDate){
                result = monthCDate - monthDDate + 1
            } else {
                result = (12 - monthDDate + 1) + monthCDate;
            }
            return result;
        },
        className: '',
    },{
        title: 'Invoices',
        data: function(row) {
            const amount = invoicesP5Amount(row.report);
            const total = invoicesP5Value(row.report);
            return (amount +" / "+ numeral(total).format('$0,0.00'));
        },
        className: '',
    },{
        title: 'Penalty',
        data: function(row) {
            return numeral(p5(row.report)).format('$0,0.00');
        },
        className: 'floatCenter',
    }, ],
    "columnDefs": [{
        "width": "10%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "20%",
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
        "width": "9%",
        "targets": 7
    }, {
        "width": "7%",
        "targets": 8
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
    "dom": '<"top">rt<"footer"><"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    "footerCallback": function(row, data, start, end, display) {
        var api = this.api(),
            data;
        // Remove the formatting to get integer data for summation
        var intVal = function(i) {
            return typeof i === 'string' ?
                numeral().unformat(i) * 1 :
                typeof i === 'number' ?
                i : 0;
        };
        // Total over all pages
        total = api
            .column(8)
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Total over this page
        pageTotal = api
            .column(8, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Update footer
        total = numeral(total).format('$0,0.00');
        pageTotal = numeral(pageTotal).format('$0,0.00');
        $(".dataTables_wrapper > .footer").html(
            pageTotal + ' (' + total + ' Total)'
        );
    },
};

Template.P5.created = function() {
    Meteor.subscribe("penalties5");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("reports");
    Meteor.subscribe("invoices");
    Meteor.subscribe("parameters");
};

Template.P5.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
    $(inputDate).inputmask("99/2099", {
        placeholder: " "
    });
    const input01 = document.getElementById('inputDate');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputBranch');
    input02.autocomplete = 'off';
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'MM/YYYY',
        });
    });
};

Template.P5.helpers({
    object: object,
    statuses: statuses,
    carriers() {
        return Carriers.find({status:"ACTIVE"}, {
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
                filter: {
                    status: "ACTIVE"
                },
            }, ]
        };
    },
});

Template.P5.events({
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'submit form': function(event) {
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const date = $(inputDate).val();
        const branch = $(inputBranch).val();
        const penalties = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < penalties.length; i++) {
            let component = Reports.findOne(penalties[i].report);
            let componentBranch = Branches.findOne(component.branch);
            let componentCarrier = Carriers.findOne(component.carrier);
            let componentDate = dateFormat(component.cDate, "mm/yyyy");
            let criteria = true;
            if (carrier != "") {
                const carrierId = Carriers.findOne({
                    "carrier": carrier
                });
                if (componentCarrier._id == carrierId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (date != "") {
                if (componentDate == date) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (branch != "") {
                const branchId = Branches.findOne({
                    "codeName": branch
                });
                if (componentBranch._id == branchId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    penalties[i]
                );
            };
        };
        return false;
    },
    'click #btnExport': function(event) {
        event.preventDefault();
        const carrier = $(inputCarrier).val();
        const date = $(inputDate).val();
        const branch = $(inputBranch).val();
        const penalties = dtData();
        let exportList = [];
        let obj = {};
        let q = 0;
        let total = 0;
        obj = {
            Carrier: "Carrier",
            Branch: "Branch",
            Title: "Title",
            Description: "Description",
            Opening: "Opening",
            DueDate: "Due Date",
            Closing: "Closing",
            Months: "Months",
            Invoices: "Invoices",
            Penalty: "Penalty",
        };
        exportList.push(obj);
        for (var i = 0; i < penalties.length; i++) {
            let component = Reports.findOne(penalties[i].report);
            let componentBranch = Branches.findOne(component.branch);
            let componentCarrier = Carriers.findOne(component.carrier);
            let componentDate = dateFormat(component.cDate, "mm/yyyy");
            let criteria = true;
            if (carrier != "") {
                const carrierId = Carriers.findOne({
                    "carrier": carrier
                });
                if (componentCarrier._id == carrierId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (date != "") {
                if (componentDate == date) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (branch != "") {
                const branchId = Branches.findOne({
                    "codeName": branch
                });
                if (componentBranch._id == branchId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                let exportMonths = function(){
                    let result;
                    const monthDDate = Number(component.dDate.substring(0, 2));
                    const yearDDate = Number(component.dDate.substring(6, 10));
                    const monthCDate = Number(component.cDate.substring(0, 2));
                    const yearCDate = Number(component.cDate.substring(6, 10));
                    if (yearDDate === yearCDate){
                        result = monthCDate - monthDDate + 1
                    } else {
                        result = (12 - monthDDate + 1) + monthCDate;
                    }
                    return result;
                };
                let exportInvoices = function(){
                    const amount = invoicesP5Amount(penalties[i].report);
                    const total = invoicesP5Value(penalties[i].report);
                    return (amount +" / "+ numeral(total).format('$0,0.00'));
                };
                let exportPenalty = function(){
                    return numeral(p5(penalties[i].report)).format('$0,0.00');
                };
                obj = {
                    Carrier: componentCarrier.carrier,
                    Branch: componentBranch.codeName,
                    Title: component.title,
                    Description: component.description,
                    Opening: component.oDate,
                    DueDate: component.dDate,
                    Closing: component.cDate,
                    Months: exportMonths(),
                    Invoices: exportInvoices(),
                    Penalty: exportPenalty(),
                };
                exportList.push(obj);
                total += numeral(p5(penalties[i].report,penalties[i].invoices));
                q++;
            };
        };
        if (q > 0) {
            obj = {
                Carrier: "TOTAL",
                Branch: "",
                Title: "",
                Description: "",
                Opening: "",
                DueDate: "",
                Closing: "",
                Months: "",
                Invoices: "",
                Penalty: numeral(total).format('$0,0.00'),
            };
            exportList.push(obj);
            JSONToCSVConvertor(exportList, "P5");
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
