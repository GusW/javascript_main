import {
  Destinations
} from '../../api/destinations.js';
import {
  Quotations
} from '../../api/quotations.js';
import {
  QuotationsLast
} from '../../api/quotations.js';
import {
  PaymentMethods
} from '../../api/paymentMethods.js';
import '../../api/purchases.js';
import './quotation.html';
import './destination.js';
import '../layout/progress.js';
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

const objectName = "Quotation";

let quotations = [];

let object = {
  name: objectName,
  menu: "Settings",
  title: "Buscar Cotações",
  destinationName: "Destino",
  inputDestinationName: "inputDestinationName",
  openingDate: "Partida",
  inputOpeningDate: "inputOpeningDate",
  closingDate: "Retorno",
  inputClosingDate: "inputClosingDate",
};


let purchase = {
  merchant_purchase_id: "Parceiro ID",
  product_code: "Código do Produto",
  destination: "Destino",
  coverage_begin: "Início",
  coverage_end: "Fim",
  payment_method: "Meio de Pagamento",
  price: "Valor",
  parcels: "Parcelas",
  holder: {
    full_name: "Nome Completo - Cartão de Crédito",
    cpf: "CPF - Cartão de Crédito",
  },
  insureds: {
    merchant_insured_id: "Beneficiário ID",
    document: "Documento",
    document_type: "Tipo de Documento",
    full_name: "Nome Completo",
    birth_date: "Data de Nascimento",
  },
  creditcard: {
    expiration_year: "Expira em (Ano)",
    expiration_month: "Expira em (Mês)",
    cvv: "CVV",
    brand: "Bandeira",
    number: "Número",
  }
};

let newPurchase = {
  merchant_purchase_id: "merchant_purchase_id",
  product_code: "product_code",
  destination: "destination",
  coverage_begin: "coverage_begin",
  coverage_end: "coverage_end",
  payment_method: "payment_method",
  price: "price",
  parcels: "parcels",
  holder: {
    full_name: "holder_full_name",
    cpf: "holder_cpf",
  },
  insureds: {
    merchant_insured_id: "insureds_merchant_insured_id",
    document: "insureds_document",
    document_type: "insureds_document_type",
    full_name: "insureds_full_name",
    birth_date: "insureds_birth_date",
  },
  creditcard: {
    expiration_year: "creditcard_expiration_year",
    expiration_month: "creditcard_expiration_month",
    cvv: "creditcard_cvv",
    brand: "creditcard_brand",
    number: "creditcard_number",
  }
};

let product = {};
let quote = {};

let dateFormat = require('dateformat');

let dtData = function() {
  return Quotations.find().fetch();
};

const alertClass = $(".alert");

function make_base_auth(user, pass) {
  const token = user + ':' + pass;
  const hash = btoa(token);
  return "Basic " + hash;
};

function invert_date(date) {
  const year = date.substring(6, 10);
  const month = date.substring(3, 5);
  const day = date.substring(0, 2);
  return year + "-" + month + "-" + day;
};

////////////////////////////////////////////////////////////////////////////////

function renderViewObject(currentRow) {
  return "<a href='#' id='" + currentRow._id + "' data-page='QuotationView' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>"
};

function getAdultPrice(currentRow) {
  const value = numeral(currentRow.adult.price).format('$ 0,0.00');
  return value;
}

function getDespesaMedica(currentRow) {
  const benefits = currentRow.benefits.benefits;
  for (let i = 0; i < benefits.length; i++) {
    if (benefits[i].name === "Despesa Médica Hospitalar") {
      const value = "USD " + numeral(benefits[i].coverage).format('0,0.00');
      return value;
    }
  };
};

function getSeguroBagagem(currentRow) {
  const benefits = currentRow.benefits.benefits;
  for (let i = 0; i < benefits.length; i++) {
    if (benefits[i].name === "Seguro de Bagagem Extraviada") {
      const value = "USD " + numeral(benefits[i].coverage).format('0,0.00');
      return value;
    }
  };
};

const dtOptions = {
  columns: [{
    title: 'Seguradora',
    data: 'provider_name',
    className: '',
  }, {
    title: 'Preço/Adulto',
    data: function(row) {
      return getAdultPrice(row);
    },
    className: 'floatCenter',
  }, {
    title: 'Despesa Médica Hospitalar',
    orderable: false,
    data: function(row) {
      return getDespesaMedica(row);
    },
    className: 'floatCenter',
  }, {
    title: 'Seguro de Bagagem Extraviada',
    orderable: false,
    data: function(row) {
      return getSeguroBagagem(row);
    },
    className: 'floatCenter',
  }, {
    title: '',
    className: "details-control",
    orderable: false,
    data: null,
    render: renderViewObject,
  }, ],
  "columnDefs": [{
    "width": "25%",
    "targets": 0
  }, {
    "width": "25%",
    "targets": 1
  }, {
    type: 'numeric-comma-brl',
    targets: 1
  }, {
    "width": "25%",
    "targets": 2
  }, {
    "width": "25%",
    "targets": 3
  }, {
    "width": "0.1%",
    "targets": 4
  }, ],
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

Template.Quotation.created = function() {
  Meteor.subscribe("destinations");
  Meteor.subscribe("quotations");
  Meteor.subscribe("quotationsLast");
  Meteor.call("destinations.fetchAPI");
  Meteor.call("paymentMethods.fetchAPI");
};

Template.Quotation.rendered = function() {
  $("table").css("width", "auto");
  const input01 = document.getElementById('inputDestinationName');
  input01.autocomplete = 'off';
  const input02 = document.getElementById('inputOpeningDate');
  input02.autocomplete = 'off';
  const input03 = document.getElementById('inputClosingDate');
  input03.autocomplete = 'off';
  $(".dateOn").datetimepicker({
    format: 'DD/MM/YYYY',
    locale: 'pt-br',
  });
  $('.dateOn').data("DateTimePicker").minDate(new Date());
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

Template.Quotation.helpers({
  object: object,
  reactiveDataFunction: function() {
    return dtData;
  },
  dtOptions: dtOptions,
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [{
        collection: Destinations,
        field: "name",
        template: Template.ac_Destination,
        matchAll: true,
      }, ]
    };
  },
  lastDestination() {
    const last = QuotationsLast.findOne();
    let result = "";
    if (last) {
      result = last.destination;
    }
    return result;
  },
  lastBegin() {
    const last = QuotationsLast.findOne();
    let result = "";
    if (last) {
      result = last.begin;
    }
    return result;
  },
  lastEnd() {
    const last = QuotationsLast.findOne();
    let result = "";
    if (last) {
      result = last.end;
    }
    return result;
  },
});

Template.Quotation.events({

  'click #btnClear': function(event) {
    form.reset();
    Meteor.call('quotations.removeAll');
    Meteor.call('quotationsLast.removeAll');
    return false;
  },
  'click .js-view': function(e, t) {
    e.preventDefault();
    const id = $(e.target).attr('id');
    product = Quotations.findOne(id);
    const href = $(e.target).attr("data-page");
    Modal.show(href);
  },
  'submit form': function(event) {
    event.preventDefault();
    Meteor.call("quotations.removeAll");
    Meteor.call("quotationsLast.removeAll");
    $("table[id*='DataTables']").dataTable().fnClearTable();
    const destination = $("#inputDestinationName").val();
    const openingDate = $("#inputOpeningDate").val();
    const closingDate = $("#inputClosingDate").val();
    Meteor.call("quotationsLast.insert", destination, openingDate, closingDate);
    quote.destination = destination;
    quote.begin = openingDate;
    quote.end = closingDate;
    const begin = invert_date(openingDate);
    const end = invert_date(closingDate);
    const dest = Destinations.findOne({
      name: destination
    }).slug;
    $(".progress").show();
    Meteor.call('quotations.fetchAPI', begin, end, dest, function(error, result) {
      if (result === 100) {
        $(".progress").hide();
      }
    });
    const quotations = Quotations.find().fetch();
    for (let i = 0; i < quotations.length; i++) {
      $("table[id*='DataTables']").dataTable().fnAddData(
        quotations[i],
      );
    };
  },
});

////////////////////////////////////////////////////////////////////////////////

const dtOptionsView = {
  columns: [{
    title: 'Categoria',
    data: function(row) {
      return row.category_name;
    },
    className: '',
  }, {
    title: 'Nome',
    data: function(row) {
      return row.name;
    },
    className: '',
  }, {
    title: 'Cobertura',
    data: function(row) {
      return row.coverage;
    },
    className: 'floatCenter',
  }, ],
  "columnDefs": [{
    "width": "25%",
    "targets": 0
  }, {
    "width": "25%",
    "targets": 1
  }, {
    "width": "25%",
    "targets": 2
  }, ],
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
  "pagingType": "simple_numbers",
};

let dtDataView = function() {
  return product.benefits.benefits;
};
Template.QuotationView.created = function() {
  Meteor.subscribe("paymentMethods");
  Meteor.subscribe("quotations");
  Meteor.subscribe("purchases");
};

Template.QuotationView.rendered = function() {
  $(".purchaseClass").hide();
  $("#savePurchase").hide();
  $(".dateFull").datetimepicker({
    format: 'DD/MM/YYYY',
    locale: 'pt-br',
  });
  $('.dateFull').data("DateTimePicker").maxDate(new Date());
  $(".dateMMYYYY").datetimepicker({
    format: 'MM/YYYY',
    locale: 'pt-br',

  });
  $('.dateMMYYYY').data("DateTimePicker").minDate(new Date());
  $("#insureds_birth_date").inputmask("date", { alias: "dd/mm/yyyy"});
  $("#creditcard_expiration").inputmask("mm/yyyy", { alias: "mm/yyyy"});
  $("#creditcard_number").inputmask("9999 9999 9999 9999", {
    placeholder: " "
  });
  $("#creditcard_cvv").inputmask("999", {
    placeholder: " "
  });
  $("#holder_cpf").inputmask("999.999.999-99", {
    placeholder: " "
  });
  $(".progressView").hide();  
};

Template.QuotationView.helpers({
  quoteDestination() {
    const destination = QuotationsLast.findOne().destination;
    return destination;
  },
  quoteBegin() {
    const begin = QuotationsLast.findOne().begin;
    return begin;
  },
  quoteEnd() {
    const end = QuotationsLast.findOne().end;
    return end;
  },
  product: product,
  reactiveDataFunction: function() {
    return dtDataView;
  },
  dtOptionsView: dtOptionsView,
  benefits() {
    return product.product.benefits;
  },
  providerName() {
    return product.provider_name;
  },
  productCode() {
    return product.code;
  },
  productName() {
    return product.name;
  },
  childMin() {
    return product.child.min_age;
  },
  childMax() {
    return product.child.max_age;
  },
  childPwC() {
    const value = numeral(product.child.price_wo_commission).format('$ 0,0.00');
    return value;
  },
  childP() {
    const value = numeral(product.child.price).format('$ 0,0.00');
    return value;
  },
  adultMin() {
    return product.adult.min_age;
  },
  adultMax() {
    return product.adult.max_age;
  },
  adultPwC() {
    const value = numeral(product.adult.price_wo_commission).format('$ 0,0.00');
    return value;
  },
  adultP() {
    const value = numeral(product.adult.price).format('$ 0,0.00');
    return value;
  },
  elderMin() {
    return product.elder.min_age;
  },
  elderMax() {
    return product.elder.max_age;
  },
  elderPwC() {
    const value = numeral(product.elder.price_wo_commission).format('$ 0,0.00');
    return value;
  },
  elderP() {
    const value = numeral(product.elder.price).format('$ 0,0.00');
    return value;
  },
  cover_pregnant() {
    return product.benefits.cover_pregnant === true ? 'green' : 'red';
  },
  pregnant_message() {
    return product.benefits.cover_pregnant === true ? 'Plano cobre gravidez' : 'Plano não cobre gravidez';
  },
  purchase: purchase,
  newPurchase: newPurchase,
  paymentMethods() {
    const payments = PaymentMethods.find().fetch();
    return payments[0].avaliable_methods;
  },
  brands() {
    const payments = PaymentMethods.find().fetch();
    return payments[0].creditcard_brands;
  },
  documentTypes() {
    const docs = [{
      doc: "RG"
    }, {
      doc: "CPF"
    }, {
      doc: "PASSPORT"
    }];
    return docs;
  },
  parcels() {
    return [{
      parcel: 1
    }, {
      parcel: 2
    }, {
      parcel: 3
    }, {
      parcel: 4
    }, {
      parcel: 5
    }, {
      parcel: 6
    }, {
      parcel: 7
    }, {
      parcel: 8
    }, {
      parcel: 9
    }, {
      parcel: 10
    }];
  }
});

Template.QuotationView.events({
  'click #buy': function(e, t) {
    e.preventDefault();
    $("#buy").hide();
    $(".purchaseClass").show();
    $("#savePurchase").show();
  },
  'submit form': function(event) {
    event.preventDefault();
    const merchant_purchase_id = $("#merchant_purchase_id").val();
    const product_code = $("#product_code").val();
    const destinationName = $("#destination").val();
    const destination = Destinations.findOne({
      name: destinationName
    }).slug;
    const coverage_begin = invert_date($("#coverage_begin").val());
    const coverage_end = invert_date($("#coverage_end").val());
    const payment_method = $("#payment_method").val();
    let price = $("#price").val();
    price = numeral().unformat(price);
    const parcels = Number($("#parcels").val());
    const holder_full_name = $("#holder_full_name").val();
    const cpf = $("#holder_cpf").val();
    const cpf1 = cpf.split('.').join("");
    const cpf2 = cpf1.split('-').join("");
    const holder_cpf = cpf2;
    const insureds_merchant_insured_id = $("#insureds_merchant_insured_id").val();
    const insureds_document = $("#insureds_document").val();
    const insureds_document_type = $("#insureds_document_type").val();
    const insureds_full_name = $("#insureds_full_name").val();
    const insureds_birth_date = invert_date($("#insureds_birth_date").val());
    let creditcard_expiration_year = ($("#creditcard_expiration").val()).substring(3, 7);
    let creditcard_expiration_month = ($("#creditcard_expiration").val()).substring(0, 2);
    const creditcard_cvv = $("#creditcard_cvv").val();
    const creditcard_brand = $("#creditcard_brand").val();
    const creditcard_number = $("#creditcard_number").val();
    $(".progressView").show();
    Meteor.call("purchases.newAPI", merchant_purchase_id, product_code, destination, coverage_begin, coverage_end, payment_method, price, parcels, holder_full_name, holder_cpf, insureds_merchant_insured_id, insureds_document, insureds_document_type, insureds_full_name, insureds_birth_date, creditcard_expiration_year, creditcard_expiration_month, creditcard_cvv, creditcard_brand, creditcard_number, function(error, result) {
      alert.type = "alert-info";
      alert.message = result + " - " + error;
      if (result) {
        $(".progressView").hide();
      }
      showHideAlert(alertClass);
    });
    return false;
  },
});

////////////////////////////////////////////////////////////////////////////////
