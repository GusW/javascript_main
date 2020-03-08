import {
    Destinations
} from '../../api/destinations.js';
import {
    Purchases
} from '../../api/purchases.js';
import {
    PurchasesInfo
} from '../../api/purchases.js';
import {
    PurchasesLast
} from '../../api/purchases.js';
import './purchase.html';
import './destination.js';
import '../layout/alert.js';
import '../localization.js';

let numeral = require('numeral');
numeral.language('pt_br', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    currency: {
        symbol: 'R$'
    },
});
numeral.language('pt_br');

const objectName = "Purchase";

let quotations = [];

let object = {
    name: objectName,
    menu: "Compras",
    title: "Buscar Compras",
    openingDate: "Início",
    inputOpeningDate: "inputOpeningDate",
    closingDate: "Fim",
    inputClosingDate: "inputClosingDate",
};

let popup = {
    objectName: "",
    title: "",
    message: "",
    import: "Importando...",
    yes: "",
    no: "",
    type: "",
    popupId: "",
    back: "",
    pro: 0,
    width: "0%",
};

let product = {};
let quote = {
    begin:"",
    end:"",
};

let dateFormat = require('dateformat');

let dtData = function() {
    return Purchases.find().fetch();
};

const alertClass = $(".alert");

function invert_date(date) {
    const year = date.substring(6, 10);
    const month = date.substring(3, 5);
    const day = date.substring(0, 2);
    return year + "-" + month + "-" + day;
};

////////////////////////////////////////////////////////////////////////////////

function getDestination(currentRow){
    const slug = currentRow.destination;
    return Destinations.findOne({slug:slug}).name;;
}

const dtOptions = {
    columns: [{
        title: 'Destino',
        data: function(row) {
            return getDestination(row);
        },
        className: '',
    }, {
        title: 'Início',
        data: function(currentRow) {
            const begin = dateFormat(new Date(currentRow.coverage_begin), "dd/mm/yyyy");
            return begin;
        },
        className: 'floatCenter',
    }, {
        title: 'Fim',
        data: function(currentRow) {
          const end = dateFormat(new Date(currentRow.coverage_end), "dd/mm/yyyy");
          return end;
        },
        className: 'floatCenter',
    }, {
        title: 'Valor',
        data: function(currentRow) {
            const price = numeral(currentRow.price).format('$ 0,0.00');
            return price;
        },
        className: 'floatCenter',
    }, {
        title: 'Status',
        data: function(currentRow) {
            const status = currentRow.status;
            return status;
        },
        className: 'floatRight',
    }, ],
    "columnDefs": [{
        "width": "20%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "20%",
        "targets": 2
    }, {
        "width": "20%",
        "targets": 3
    }, {
        "width": "20%",
        "targets": 4
    },],
    searching: false,
    autoWidth: true,
    "responsive": true,
    "stateSave": true,
    "language": {
        "lengthMenu": dt_PT.lengthMenu,
        "zeroRecords": dt_PT.zeroRecords,
        "info": dt_PT.info,
        "infoEmpty": dt_PT.infoEmpty,
        "infoFiltered": dt_PT.infoFiltered,
        "paginate": {
            "first": dt_PT.paginate.first,
            "last": dt_PT.paginate.last,
            "next": dt_PT.paginate.next,
            "previous": dt_PT.paginate.previous,
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
};

Template.Purchase.created = function() {
    Meteor.subscribe("destinations");
    Meteor.subscribe("purchases");
    Meteor.subscribe("purchasesInfo");
    Meteor.subscribe("purchasesLast");
};

Template.Purchase.rendered = function() {
    $("table").css("width", "auto");
    const input02 = document.getElementById('inputOpeningDate');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputClosingDate');
    input03.autocomplete = 'off';
    $(".dateOn").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'pt-br',
    });
    $(".dateOff").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'pt-br',
        useCurrent: false,
    });
    $('.dateOff').data("DateTimePicker").minDate(new Date());
    $(".dateOn").on("dp.change", function(e) {
        $('.dateOff').data("DateTimePicker").minDate(e.date);
    });
    $(".dateOff").on("dp.change", function(e) {
        $('.dateOn').data("DateTimePicker").maxDate(e.date);
    });
    $("#inputOpeningDate").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputClosingDate").inputmask("99/99/2099", {
        placeholder: " "
    });
    $(".progress").hide();
};

Template.Purchase.helpers({
    object: object,
    reactiveDataFunction: function() {
        return dtData;
    },
    dtOptions: dtOptions,
    lastBegin(){
      const last = PurchasesLast.findOne();
      let result = "";
      if (last){
        result = last.begin;
      }
      return result
    },
    lastEnd(){
      const last = PurchasesLast.findOne();
      let result = "";
      if (last) {
        result = last.end;
      }
      return result;
    },
});

Template.Purchase.events({

    'click #btnClear': function(event) {
        form.reset();
        Meteor.call('purchases.removeAll');
        Meteor.call('purchasesLast.removeAll');
        return false;
    },
    'submit form': function(event) {
        event.preventDefault();
        Meteor.call('purchases.removeAll');
        Meteor.call('purchasesLast.removeAll');
        $("table[id*='DataTables']").dataTable().fnClearTable();
        const openingDate = $("#inputOpeningDate").val();
        const closingDate = $("#inputClosingDate").val();
        Meteor.call('purchasesLast.insert', openingDate, closingDate);
        const begin = invert_date(openingDate);
        const end = invert_date(closingDate);
        $(".progress").show();
        Meteor.call('purchases.fetchAPI', begin, end, function (error, result) {
          if (result === 100){
              $(".progress").hide();
          }
        });
        const purchases = Purchases.find().fetch();
        for (let i = 0; i < purchases.length; i++){
          $("table[id*='DataTables']").dataTable().fnAddData(
                    purchases[i],
                );
        };
    },
});
