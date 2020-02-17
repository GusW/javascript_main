import {
    Penalties1
} from '../../api/penalties1.js';
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
    Incidents
} from '../../api/incidents.js';
import {
    Parameters
} from '../../api/parameters.js';
import './incident.js';
import './penalty1.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';
import '../function.js';

var dateFormat = require('dateformat');
var numeral = require('numeral');

const objectName = "P1";

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
    return Penalties1.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputDate = "#" + object.inputDate;
const inputBranch = "#" + object.inputBranch;

function p1_lim(incident){
    let lim;
    const object = Incidents.findOne({_id:incident});
    const carrier = object.carrier;
    const carrierATT = Carriers.findOne({carrier:"AT&T"});
    const param = Parameters.findOne({penalty:"P1"});
    if (carrier === carrierATT._id){
        lim = param.factor03/100;
    } else {
        lim = param.factor03/100;
    }
    return lim;
};

serviceAvailability = function(incident) {
    let time, timeMax, avail;
    let minDate, maxDate;
    const object = Incidents.findOne({
        _id: incident
    });
    let oDate = object.oDate;
    let cDate = object.cDate;
    const monthYearODate = oDate.substring(0,2) + "/" + oDate.substring(6,10);
    const monthYearCDate = cDate.substring(0,2) + "/" + cDate.substring(6,10);
    const lim = p1_lim(incident);
    if (monthYearODate === monthYearCDate){
        const month = Number(monthYearODate.substring(0,2));
        const year = Number(monthYearODate.substring(3,7));
        oDate = object.oDate;
        cDate = object.cDate;
        minDate = String(monthToString(month) +"/01/"+ year + " 00:00");
        maxDate = String(monthToString(month) +"/"+ monthDays(monthToString(month) +"/"+ year) +"/"+ year + " 23:59");
        time = Math.abs((new Date(cDate)).getTime() - (new Date(oDate)).getTime());
        timeMax = Math.abs((new Date(maxDate)).getTime() - (new Date(minDate)).getTime());
        avail = Number(1 - (time/timeMax)).toFixed(4);
        if (lim > avail){
            Meteor.call("penalties1.insert", incident, oDate, cDate, avail, Meteor.userId());
        }
    } else {
        const monthODate = Number(monthYearODate.substring(0,2));
        const monthCDate = Number(monthYearCDate.substring(0,2));
        const yearODate = Number(monthYearODate.substring(3,7));
        const yearCDate = Number(monthYearCDate.substring(3,7));
        if (yearODate === yearCDate) {
            for (let i = monthODate; i <= monthCDate; i++){
                if (i === monthODate) {
                    oDate = object.oDate;
                    cDate = String(monthToString(i) + "/" + monthDays(monthYearODate) +"/"+ yearODate + " 23:59");
                    minDate = String(monthToString(monthODate) +"/01/"+ yearODate + " 00:00");
                    maxDate = cDate;
                } else if (i !== monthODate && i !== monthCDate){
                    oDate = String(monthToString(i) +"/01/"+ yearODate + " 00:00");
                    cDate = String(monthToString(i) +"/"+ monthDays(monthToString(i) +"/"+ yearODate) +"/"+ yearODate + " 23:59");
                    minDate = oDate;
                    maxDate = cDate;
                } else {
                    oDate = String(monthToString(i) +"/01/"+ yearODate + " 00:00");
                    cDate = object.cDate;
                    minDate = oDate;
                    maxDate = String(monthToString(i) +"/"+ monthDays(monthToString(i) +"/"+ yearODate) +"/"+ yearODate + " 23:59");
                }
                time = Math.abs((new Date(cDate)).getTime() - (new Date(oDate)).getTime());
                timeMax = Math.abs((new Date(maxDate)).getTime() - (new Date(minDate)).getTime());
                avail = Number(1 - (time/timeMax)).toFixed(4);
                if (lim > avail){
                    Meteor.call("penalties1.insert", incident, oDate, cDate, avail, Meteor.userId());
                }
            }
        } else {
            console.log("Dammit " + incident);
        }
    }
};

function p1(penalty1) {
    let penaltyValue = 0;
    const penalty = Penalties1.findOne({_id:penalty1});
    const incidentId = penalty.incident;
    const incident = Incidents.findOne({_id:incidentId});
    const carrier = incident.carrier;
    const branch = incident.branch;
    const phone = incident.phone;
    const oDate = penalty.oDate;
    const monthYear = dateFormat(oDate, "mm/yyyy");
    const invoice = Invoices.findOne({
        carrier: carrier,
        branch: branch,
        date: monthYear,
        phone: phone,
    });
    if (invoice !== undefined){
        const carrierATT = Carriers.findOne({
            carrier: "AT&T"
        });
        const param = Parameters.findOne({
            penalty: "P1"
        });
        if (carrier === carrierATT._id) {
            penaltyValue = (param.factor04 + (penalty.availability/100)) * numeral().unformat(invoice.value);
        } else {
            penaltyValue = param.factor02 * numeral().unformat(invoice.value);
        }
    }
    return penaltyValue;
};

////////////////////////////////////////////////////////////////////////////////

const dtOptions = {
    columns: [{
        title: 'Carrier',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            const carrier = Carriers.findOne(incident.carrier);
            return carrier.carrier;
        },
        className: '',
    }, {
        title: 'Branch',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            const branch = Branches.findOne(incident.branch);
            return branch.codeName;
        },
        className: '',
    }, {
        title: 'Contract',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return incident.contract;
        },
        className: 'floatCenter',
    }, {
        title: 'Number',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return incident.number;
        },
        className: '',
    }, {
        title: 'Phone',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return incident.phone;
        },
        className: 'floatCenter',
    }, {
        title: 'Opening',
        data: 'oDate',
        className: 'floatCenter',
    }, {
        title: 'Closing',
        data: 'cDate',
        className: 'floatCenter',
    }, {
        title: 'Availability',
        data: 'availability',
        className: 'floatCenter',
    }, {
        title: 'Penalty',
        data: function(row) {
            return numeral(p1(row._id)).format('$0,0.00')
        },
        className: 'floatCenter',
    }, ],
    "columnDefs": [{
        "width": "15%",
        "targets": 0
    }, {
        "width": "30%",
        "targets": 1
    }, {
        "width": "7%",
        "targets": 2
    }, {
        "width": "10%",
        "targets": 3
    }, {
        "width": "10%",
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

Template.P1.created = function() {
    Meteor.subscribe("penalties1");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("incidents");
    Meteor.subscribe("invoices");
    Meteor.subscribe("parameters");
};

Template.P1.rendered = function() {
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

Template.P1.helpers({
    object: object,
    statuses: statuses,
    carriers() {
        return Carriers.find({
            status: "ACTIVE"
        }, {
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

Template.P1.events({
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
            let component = Incidents.findOne(penalties[i].incident);
            let componentBranch = Branches.findOne(component.branch);
            let componentCarrier = Carriers.findOne(component.carrier);
            let componentDate = dateFormat(penalties[i].oDate, "mm/yyyy");
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
            Contract: "Contract",
            Number: "Number",
            Phone: "Phone",
            Opening: "Opening",
            Closing: "Closing",
            Availability: "Availability",
            Description: "Description",
            Penalty: "Penalty",
        };
        exportList.push(obj);
        for (var i = 0; i < penalties.length; i++) {
            let component = Incidents.findOne(penalties[i].incident);
            let componentBranch = Branches.findOne(component.branch);
            let componentCarrier = Carriers.findOne(component.carrier);
            let componentDate = dateFormat(penalties[i].oDate, "mm/yyyy");
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
                obj = {
                    Carrier: componentCarrier.carrier,
                    Branch: componentBranch.codeName,
                    Contract: component.contract,
                    Number: component.number,
                    Phone: component.phone,
                    Opening: penalties[i].oDate,
                    Closing: penalties[i].cDate,
                    Availability: penalties[i].availability,
                    Description: component.description,
                    Penalty: numeral(p1(penalties[i]._id)).format('$0,0.00'),
                };
                exportList.push(obj);
                total += numeral().unformat(p1(penalties[i]._id));
                q++;
            };
        };
        if (q > 0) {
            obj = {
                Carrier: "TOTAL",
                Branch: "",
                Contract: "",
                Number: "",
                Phone: "",
                Opening: "",
                Closing: "",
                Availability: "",
                Description: "",
                Penalty: numeral(total).format('$0,0.00'),
            };
            exportList.push(obj);
            JSONToCSVConvertor(exportList, "P1");
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
