import {
    Penalties3
} from '../../api/penalties3.js';
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
import './penalty3.html';
import './incident.js';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

var dateFormat = require('dateformat');
var numeral = require('numeral');

const objectName = "P3";

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
    return Penalties3.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputDate = "#" + object.inputDate;
const inputBranch = "#" + object.inputBranch;

////////////////////////////////////////////////////////////////////////////////

monthlyInterruptions = function(incidentId) {
    let amount = 0;
    const incident = Incidents.findOne({
        _id: incidentId
    });
    const carrier = incident.carrier;
    const branch = incident.branch;
    const phone = incident.phone;
    const contract = incident.contract;
    const date = dateFormat(incident.oDate, "mm/yyyy");
    const interruptions = Incidents.find({
        branch:branch,
        carrier:carrier,
        contract:contract,
        phone:phone,
    }).fetch();
    for (let i = 0; i < interruptions.length; i++){
        if (dateFormat(interruptions[i].oDate, "mm/yyyy") === date && interruptions[i].responsibility === "CARRIER"){
            amount++;
        }
    };
    if (amount > 1){
        return amount;
    } else {
        return false;
    }
};

function p3(incident) {
    let penalty = 0;
    const interruptions = monthlyInterruptions(incident);
    const invoice = invoiceIncident(incident);
    const object = Incidents.findOne({
        _id: incident
    });
    const carrier = object.carrier;
    const carrierATT = Carriers.findOne({
        carrier: "AT&T"
    });
    const param = Parameters.findOne({
        penalty: "P3"
    });
    if (carrier === carrierATT._id) {
        penalty = param.factor03 * param.factor04 * interruptions * numeral().unformat(invoice);
    } else {
        penalty = param.factor01 * param.factor02 * (interruptions - 1);
    }
    return penalty;
};

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
        title: 'Phone',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return incident.phone;
        },
        className: 'floatCenter',
    }, {
        title: 'Date',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return dateFormat(incident.oDate,"mm/yyyy");
        },
        className: 'floatCenter',
    }, {
        title: 'Interruptions',
        data: function(row) {
            return monthlyInterruptions(row.incident);
        },
        className: 'floatCenter',
    }, {
        title: 'Penalty',
        data: function(row) {
            return numeral(p3(row.incident)).format('$0,0.00')
        },
        className: 'floatCenter',
    }, ],
    "columnDefs": [{
        "width": "20%",
        "targets": 0
    }, {
        "width": "30%",
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
        "width": "20%",
        "targets": 6
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
            .column(6)
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Total over this page
        pageTotal = api
            .column(6, {
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

Template.P3.created = function() {
    Meteor.subscribe("penalties3");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("incidents");
    Meteor.subscribe("invoices");
    Meteor.subscribe("parameters");
};

Template.P3.rendered = function() {
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

Template.P3.helpers({
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

Template.P3.events({
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
            Contract: "Contract",
            Phone: "Phone",
            Date: "Date",
            Interruptions: "Interruptions",
            Penalty: "Penalty",
        };
        exportList.push(obj);
        for (var i = 0; i < penalties.length; i++) {
            let component = Incidents.findOne(penalties[i].incident);
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
                obj = {
                    Carrier: componentCarrier.carrier,
                    Branch: componentBranch.codeName,
                    Contract: component.contract,
                    Phone: component.phone,
                    Date: dateFormat(component.oDate, "mm/yyyy"),
                    Interruptions: monthlyInterruptions(penalties[i].incident),
                    Penalty: numeral(p3(penalties[i].incident)).format('$0,0.00'),
                };
                exportList.push(obj);
                total += numeral().unformat(p3(penalties[i].incident));
                q++;
            };
        };
        if (q > 0) {
            obj = {
                Carrier: "TOTAL",
                Branch: "",
                Contract: "",
                Phone: "",
                Date: "",
                Interruptions: "",
                Penalty: numeral(total).format('$0,0.00'),
            };
            exportList.push(obj);
            JSONToCSVConvertor(exportList, "P3");
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
