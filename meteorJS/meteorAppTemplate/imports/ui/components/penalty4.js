import {
    Penalties4
} from '../../api/penalties4.js';
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
    Circulars
} from '../../api/circulars.js';
import {
    Parameters
} from '../../api/parameters.js';
import './penalty4.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

var dateFormat = require('dateformat');
var numeral = require('numeral');

const objectName = "P4";

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
    return Penalties4.find().fetch();
};

const alertClass = $(".alert");
const inputCarrier = "#" + object.inputCarrier;
const inputDate = "#" + object.inputDate;
const inputBranch = "#" + object.inputBranch;

////////////////////////////////////////////////////////////////////////////////

circular_lim = function(circular) {
    const object = Circulars.findOne({_id:circular});
    const bundle = object.bundle;
    const type = object.type;
    let lim;
    if (type.includes("1")) {
        if (bundle.includes("ANA")) {
            lim = 7;
        } else {
            lim = 30;
        };
    } else if (type.includes("3")) {
        lim = 30;
    } else if (type.includes("BUN")) {
        lim = 7
    } else {
        lim = 30
    };
    return lim;
};

p4_ready = function (circular){
    const object = Circulars.findOne({_id:circular});
    if (object.cDate !== ""){
        const lim = circular_lim(circular);
        const time = Math.abs((new Date(object.cDate)).getTime() - (new Date(object.oDate)).getTime());
        const total = (Math.ceil(time / (1000 * 3600 * 24)) - lim);
        if (total > 0){
            return total;
        }
    }
    return false;
};

function p4(circular) {
    let penalty = 0;
    const total = p4_ready(circular);
    const object = Circulars.findOne({_id:circular});
    const carrier = object.carrier;
    const param = Parameters.findOne({
        penalty: "P4"
    });
    const carrierATT = Carriers.findOne({
        carrier: "AT&T"
    });
    if (carrier == carrierATT._id) {
        penalty = total * param.factor03 + param.factor04;
    } else {
        penalty = total * param.factor01 + param.factor02;
    };
    return penalty;
};

const dtOptions = {
    columns: [{
        title: 'Carrier',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            const carrier = Carriers.findOne(circular.carrier);
            return carrier.carrier;
        },
        className: '',
    }, {
        title: 'Branch',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            const branch = Branches.findOne(circular.branch);
            return branch.codeName;
        },
        className: '',
    }, {
        title: 'Bundle',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            return circular.bundle;
        },
        className: 'floatCenter',
    }, {
        title: 'Type',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            return circular.type;
        },
        className: '',
    }, {
        title: 'Code',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            return circular.code;
        },
        className: 'floatCenter',
    }, {
        title: 'Number',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            return circular.number;
        },
        className: 'floatCenter',
    }, {
        title: 'Opening',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            return circular.oDate;
        },
        className: 'floatCenter',
    },{
        title: 'Closing',
        data: function(row) {
            const circular = Circulars.findOne(row.circular);
            return circular.cDate;
        },
        className: 'floatCenter',
    },{
        title: 'Penalty',
        data: function(row) {
            return numeral(p4(row.circular)).format('$0,0.00')
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

Template.P4.created = function() {
    Meteor.subscribe("penalties4");
    Meteor.subscribe("carriers");
    Meteor.subscribe("branches");
    Meteor.subscribe("circulars");
    Meteor.subscribe("parameters");
};

Template.P4.rendered = function() {
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

Template.P4.helpers({
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

Template.P4.events({
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
            let component = Circulars.findOne(penalties[i].circular);
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
            Code: "Code",
            Number: "Number",
            Bundle: "Bundle",
            Type: "Type",
            Opening: "Opening",
            Closing: "Closing",
            Penalty: "Penalty",
        };
        exportList.push(obj);
        for (var i = 0; i < penalties.length; i++) {
            let component = Circulars.findOne(penalties[i].circular);
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
                    Code: component.code,
                    Number: component.number,
                    Bundle: component.bundle,
                    Type: component.type,
                    Opening: component.oDate,
                    Closing: component.cDate,
                    Penalty: numeral(p4(penalties[i].circular)).format('$0,0.00'),
                };
                exportList.push(obj);
                total += p4(penalties[i].circular);
                q++;
            };
        };
        if (q > 0) {
            obj = {
                Carrier: "TOTAL",
                Branch: "",
                Code: "",
                Number: "",
                Bundle: "",
                Type: "",
                Opening: "",
                Closing: "",
                Penalty: numeral(total).format('$0,0.00'),
            };
            exportList.push(obj);
            JSONToCSVConvertor(exportList, "P4");
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
