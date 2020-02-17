import {
    Penalties2
} from '../../api/penalties2.js';
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
import './penalty2.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

var dateFormat = require('dateformat');
var numeral = require('numeral');

const objectName = "P2";

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
    return Penalties2.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputDate = "#" + object.inputDate;
const inputBranch = "#" + object.inputBranch;

serviceRecovery = function(incident) {
    const object = Incidents.findOne({
        _id: incident
    });
    const param = Parameters.findOne({
        penalty: "P2"
    });
    const carrier = object.carrier;
    const carrierATT = Carriers.findOne({
        carrier: "AT&T"
    });
    const time = Math.abs((new Date(object.cDate)).getTime() - (new Date(object.oDate)).getTime());
    const total = (time / (1000 * 3600)).toFixed(2);
    let lim;
    if (carrier === carrierATT._id) {
        lim = param.factor03;
    } else {
        lim = param.factor01;
    }
    if (total > lim) {
        return total;
    } else {
        return false;
    }
};

function p2(incident) {
    let penalty = 0;
    const invoice = invoiceIncident(incident);
    if (invoice !== 0){
        const object = Incidents.findOne({
            _id: incident
        });
        const carrier = object.carrier;
        const carrierATT = Carriers.findOne({
            carrier: "AT&T"
        });
        const time = serviceRecovery(incident);
        const param = Parameters.findOne({
            penalty: "P2"
        });
        if (carrier === carrierATT._id) {
            penalty = (param.factor04 / 100) * numeral().unformat(invoice);
        } else {
            penalty = (param.factor02 / 100) * time * numeral().unformat(invoice);
        }
    }
    return penalty;
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
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return incident.oDate;
        },
        className: 'floatCenter',
    }, {
        title: 'Closing',
        data: function(row) {
            const incident = Incidents.findOne(row.incident);
            return incident.cDate;
        },
        className: 'floatCenter',
    }, {
        title: 'Hours',
        data: function(row) {
            return serviceRecovery(row.incident);
        },
        className: 'floatCenter',
    }, {
        title: 'Penalty',
        data: function(row) {
            return numeral(p2(row.incident)).format('$0,0.00')
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

Template.P2.created = function() {
    Meteor.subscribe("penalties2");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("incidents");
    Meteor.subscribe("invoices");
    Meteor.subscribe("parameters");
};

Template.P2.rendered = function() {
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

Template.P2.helpers({
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

Template.P2.events({
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
            Number: "Number",
            Phone: "Phone",
            Opening: "Opening",
            Closing: "Closing",
            Hours: "Hours",
            Description: "Description",
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
                    Number: component.number,
                    Phone: component.phone,
                    Opening: component.oDate,
                    Closing: component.cDate,
                    Hours: serviceRecovery(penalties[i].incident),
                    Description: component.description,
                    Penalty: numeral(p2(penalties[i].incident)).format('$0,0.00'),
                };
                exportList.push(obj);
                total += numeral().unformat(p2(penalties[i].incident));
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
                Hours: "",
                Description: "",
                Penalty: numeral(total).format('$0,0.00'),
            };
            exportList.push(obj);
            JSONToCSVConvertor(exportList, "P2");
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
