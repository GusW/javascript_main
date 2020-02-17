import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import 'meteor/session';
import './main.html';
import '/node_modules/xlsx/xlsx.js';
import '/node_modules/jszip';
// import '/node_modules/moment';
// import '/node_modules/moment/locale/pt-br.js';

Operadoras = new Mongo.Collection('operadoras');
Unidades = new Mongo.Collection('unidades');
Relatorios = new Mongo.Collection('relatorios');
Oficios = new Mongo.Collection('oficios');
Ocorrencias = new Mongo.Collection('ocorrencias');
Faturas = new Mongo.Collection('faturas');
Parametros = new Mongo.Collection('parametros');
Perfis = new Mongo.Collection('perfis');
PenalidadesP5 = new Mongo.Collection('penalidadesP5');
PenalidadesP4 = new Mongo.Collection('penalidadesP4');
PenalidadesP3 = new Mongo.Collection('penalidadesP3');
PenalidadesP2 = new Mongo.Collection('penalidadesP2');
PenalidadesP1 = new Mongo.Collection('penalidadesP1');

////////////////////////////////////////////////////////////////////////////////

param = function() {
    return Parametros.findOne(); // or .map()
};

function getJsDateFromExcel(excelDate) {
    return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
};

////////////////////////////////////////////////////////////////////////////////

var xlsx = require('xlsx');

var numeral = require('numeral');
numeral.language('pt-br', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'm',
        million: 'M',
        billion: 'B',
        trillion: 'T'
    },
    ordinal: function(number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: 'R$'
    }
});

// switch between languages
numeral.language('pt-br');

function valorMongo(valor) {
    return Number((valor).replace("R$", "").replace(".", "").replace(",", "."));
};

////////////////////////////////////////////////////////////////////////////////

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

var dateFormat = require('dateformat');

function validaDataBR(data) {
    if (data.length != 10) {
        return false;
    };
    var dia = data.substring(0, 2);
    var mes = data.substring(3, 5);
    var ano = data.substring(6, 10);
    if (!Number(dia)) {
        return false;
    };
    if (!Number(mes)) {
        return false;
    } else if (Number(mes) <= 0 || Number(mes) > 12) {
        return false;
    };
    if (!Number(ano)) {
        return false;
    } else if (Number(ano) <= 2000 || Number(ano) > 2099) {
        return false;
    };
    var data = {
        dia: dia,
        mes: mes,
        ano: ano,
    }
    return data;
};

function dataBR_mongo(dataBR) {
    var data = validaDataBR(dataBR);
    var dia = data.dia;
    var mes = data.mes;
    var ano = data.ano;
    if (dia && mes && ano) {
        var mongoDate = new Date(ano + "-" + mes + "-" + dia + "T00:00:00");
        return dateFormat(mongoDate, "dd/mm/yyyy");
    };
    return false;
};

function dataMongo(data) {
    var data = validaDataBR(data);
    var dia = data.dia;
    var mes = data.mes;
    var ano = data.ano;
    if (dia && mes && ano) {
        return new Date(ano + "-" + mes + "-" + dia + "T00:00:00");
    };
};

function dataJS_BR(data) {
    var dia = String(data.getDate());
    var mes = String(data.getMonth() + 1);
    var ano = String(data.getFullYear());
    if (dia.length == 1) {
        dia = "0" + dia;
    };
    if (mes.length == 1) {
        mes = "0" + mes;
    };
    var dataBR = (dia + "/" + mes + "/" + ano);
    return dataBR_mongo(dataBR);
};

function dataJS_BR_Full(data) {
    var data2 = data + " +0000";
    var data3 = new Date(data2);
    var dia = data3.getDate();
    var mes = data3.getMonth() + 1;
    var ano = data3.getFullYear();
    if (dia < 10) {
        dia = "0" + dia;
    };
    if (mes < 10) {
        mes = "0" + mes;
    };
    var horas = data3.getUTCHours();
    var minutos = data3.getMinutes();
    var segundos = data3.getSeconds();
    if (horas < 10) {
        horas = "0" + horas;
    };
    if (minutos < 10) {
        minutos = "0" + minutos;
    };
    if (segundos < 10) {
        segundos = "0" + segundos;
    };
    var date = ano + "-" + mes + "-" + dia + " " + horas + ":" + minutos + ":" + segundos + "+0000";
    var mongoDate = new Date(date);
    return dateFormat(mongoDate, "dd/mm/yyyy HH:MM:ss");
};


function dateBR_full(date) {
    return dateFormat(date, "dd/mm/yyyy HH:MM:ss");
};

function dateBR(date) {
    return dateFormat(date, "dd/mm/yyyy");
};

function monthBR(date) {
    var month = dateFormat(date, "dd/mm/yyyy HH:MM:ss");
    return month.slice(3, 5);
};

function yearBR(date) {
    var year = dateFormat(date, "dd/mm/yyyy HH:MM:ss");
    return year.slice(6, 10);
};

function validaMesAnoBR(data) {

    if (data.length == 6) {
        var mes = data.substring(0, 1);
        var ano = data.substring(2, 6);
    } else if (data.length == 7) {
        var mes = data.substring(0, 2);
        var ano = data.substring(3, 7);
    } else {
        return false;
    };
    if (!Number(mes)) {
        return false;
    } else if (Number(mes) <= 0 || Number(mes) > 12) {
        return false;
    };
    if (!Number(ano)) {
        return false;
    } else if (Number(ano) <= 2000 || Number(ano) > 2099) {
        return false;
    };
    var mesAno = {
        mes: mes,
        ano: ano,
    }
    return mesAno;
};

function mesAnoBR_mongo(data) {
    var dia = "1";
    if (data.length == 6) {
        var mes = data.substring(0, 1);
        var ano = data.substring(2, 6);
    } else {
        var mes = data.substring(0, 2);
        var ano = data.substring(3, 7);
    };
    if (mes && ano) {
        var mongoDate = new Date(ano + "-" + mes + "-" + dia + "T00:00:00");
        return dateFormat(mongoDate, "mm/yyyy");
    };
    return false;
};

function monthYearBR(data) {
    if (data.length == 6) {
        var mes = data.substring(0, 1);
        mes = "0" + mes;
        var ano = data.substring(2, 6);
    } else {
        var mes = data.substring(0, 2);
        var ano = data.substring(3, 7);
    };
    if (mes && ano) {
        return (mes + "/" + ano);
    };
    return false;
};

function mongo_mesAnoBR(data) {
    var mes = data.getMonth();
    var ano = data.getFullYear();
    var mesAno = mes + "/" + ano;
    return mesAno;
};

function getDiasMA(mes, ano) {
    var dias;
    if (mes == 2) {
        if (ano % 4 == 0 && ano % 100 != 0) {
            dias = 29;
        } else {
            dias = 28;
        };
    };
    if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
        dias = 31;
    } else {
        dias = 30;
    };
    return dias;
};

////////////////////////////////////////////////////////////////////////////////

function validaDataRel(abertura, vencimento, fechamento) {
    var abre = dataMongo(abertura);
    var vence = dataMongo(vencimento);
    var fecha = dataMongo(fechamento);
    if (abre > vence) {
        return false;
    };
    if (fechamento) {
        if (abre > fecha) {
            return false;
        };
    };
    return true;
};

function validaDataOfi(abertura, finalizacao) {
    var abre = dataMongo(abertura);
    var fecha = dataMongo(finalizacao);
    if (fecha) {
        if (abre > fecha) {
            return false;
        };
    };
    return true;
};

function validaUnicoOfi(codigo, oficio) {
    var reg = Oficios.findOne({
        "codigo": codigo,
        "oficio": oficio,
    });
    if (reg) {
        return false;
    };
    return true;
};

function validaUnicoOfiEdit(codigo, oficio, id) {
    var reg = Oficios.findOne({
        "codigo": codigo,
        "oficio": oficio,
    });
    if (reg) {
        if (reg._id != id) {
            return false;
        };
    };
    return true;
};


////////////////////////////////////////////////////////////////////////////////

function JSONToCSVConvertor(JSONData, ReportTitle) {

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '";';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }
    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    var fileName = "Relação_de_";
    fileName += ReportTitle.replace(/ /g, "_");
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

////////////////////////////////////////////////////////////////////////////////

var alert;

function showHideAlert(classe) {
    classe.show();
    setTimeout(function() {
        classe.hide();
    }, 5000);
};

var modals = {
    modalTitle: "",
    modalMessage: "",
    modalYes: "",
    modalNo: "",
    modalType: "",
    modalId: "",
    pro: 0,
    width: "0%",
};

Template.popUp.helpers({
    modals: modals
});

Template.popUp.rendered = function() {
    $(".progress").hide();
};

Template.popUp.events({
    'click #editOco': function(event) {
        Modal.hide();
        var responsabilidade = $("#inputResponsabilidade").val();
        var descricao = $("#inputDescricao").val();
        Ocorrencias.update(modals.modalId, {
            $set: {
                responsabilidade: responsabilidade,
                descricao: descricao,
                modificadoEm: dataEHora(),
                modificadoPor: Meteor.user(),
            },
        });
        var p1 = PenalidadesP1.find({
            "ocorrencia._id": modals.modalId,
        }).fetch();
        if (p1) {
            for (var i1 = 0; i1 < p1.length; i1++) {
                PenalidadesP1.remove(p1[i1]._id);
            };
        };
        var p2 = PenalidadesP2.find({
            "ocorrencia._id": modals.modalId,
        }).fetch();
        if (p2) {
            for (var i2 = 0; i2 < p2.length; i2++) {
                PenalidadesP2.remove(p2[i2]._id);
            };
        };
        var p3 = PenalidadesP3.find({
            "ocorrencia._id": modals.modalId,
        }).fetch();
        if (p3) {
            for (var i3 = 0; i3 < p3.length; i3++) {
                PenalidadesP3.remove(p3[i3]._id);
            };
        };
        m_oco.oco_novo = true;
        alert = $(".alert-success");
        showHideAlert(alert);
    },
    'click #backEditOco': function(event) {
        Modal.hide();
        m_oco.oco_pen = false;
        m_oco.m_operadora = "";
        m_oco.m_unidade = "";
        m_oco.m_chave = "";
        m_oco.m_abertura = "";
        m_oco.m_finalizacao = "";
        m_oco.oco_novo = false;
        Session.set('activeModal', "m_oco");
        m_oco.oco_novo = false;
    },
    'click #delOfi': function(event) {
        Modal.hide();
        var p4 = PenalidadesP4.find({
            "oficio._id": modals.modalId,
        }).fetch();
        if (p4) {
            for (var i4 = 0; i4 < p4.length; i4++) {
                PenalidadesP4.remove(p4[i4]._id);
            };
        };
        Oficios.remove(modals.modalId);
        alert = $(".alert-info");
        showHideAlert(alert);
        m_ofi.ofi_novo = false;
    },
    'click #editDelOfi': function(event) {
        Modal.hide();
        var p4 = PenalidadesP4.find({
            "oficio._id": modals.modalId,
        }).fetch();
        if (p4) {
            for (var i4 = 0; i4 < p4.length; i4++) {
                PenalidadesP4.remove(p4[i4]._id);
            };
        };
        Oficios.remove(modals.modalId);
        Session.set('activeModal', 'm_ofi');
        $("#bread_2").html("Relatórios");
        $("#bread_3").html("Manter Ofícios");
        m_ofi.ofi_novo = false;
    },
    'click #editOfi': function(event) {
        Modal.hide();
        var data;
        var today = dataJS_BR(new Date());
        var abertura = $("#inputDataAbertura").val();
        var finalizacao = $("#inputDataFinalizacao").val();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var oficio = $("#inputOficio").val();
        var status = $("#inputStatus").val();
        var operadora = $("#inputOperadora").val();
        var codigo = $("#inputCodigo").val();
        var tipo = $("#inputTipo").val();
        var unidadeObj = Unidades.findOne({
            "unidade_name": unidade,
        });
        var operadoraObj = Operadoras.findOne({
            "operadora_name": operadora,
        });
        if (!unidadeObj) {
            alert = $(".alert-warning");
            showHideAlert(alert);
            m_ofi.ofi_novo = false;
        } else if (!validaUnicoOfiEdit(codigo, oficio, modals.modalId)) {
            alert("Já existe um outro registro de Ofício com o mesmo Código e número de Ofício. Favor modificar e tentar novamente.");
            m_ofi.ofi_novo = false;
        } else {
            if (dataBR_mongo(finalizacao)) {
                data = dataBR_mongo(finalizacao);
            } else {
                data = "";
            }
            Oficios.update(modals.modalId, {
                $set: {
                    abertura: dataBR_mongo(abertura),
                    finalizacao: data,
                    unidade: unidadeObj,
                    feixe: feixe,
                    oficio: oficio,
                    status: status,
                    operadora: operadoraObj,
                    codigo: Number(codigo),
                    tipo: tipo,
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
            var p4 = PenalidadesP4.find({
                "oficio._id": modals.modalId,
            }).fetch();
            if (p4) {
                for (var i4 = 0; i4 < p4.length; i4++) {
                    PenalidadesP4.remove(p4[i4]._id);
                };
            };
            m_ofi.ofi_novo = true;
            alert = $(".alert-success");
            showHideAlert(alert);
        };
    },
    'click #backEditOfi': function(event) {
        Modal.hide();
        m_ofi.m_codigo = "";
        m_ofi.m_oficio = "";
        m_ofi.m_feixe = "";
        m_ofi.m_tipo = "";
        m_ofi.m_status = "";
        m_ofi.m_operadora = "";
        m_ofi.m_abertura = "";
        m_ofi.m_finalizacao = "";
        m_ofi.m_unidade = "";
        Session.set('activeModal', "m_ofi");
        m_ofi.ofi_novo = false;
    },
    'click #newOfi': function(event) {
        Modal.hide();
        var abertura = $("#inputDataAbertura").val();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var oficio = $("#inputOficio").val();
        var status = $("#inputStatus").val();
        var operadora = $("#inputOperadora").val();
        var codigo = $("#inputCodigo").val();
        var tipo = $("#inputTipo").val();
        var unidadeObj = Unidades.findOne({
            "unidade_name": unidade,
        });
        var operadoraObj = Operadoras.findOne({
            "operadora_name": operadora,
        });
        if (!unidadeObj) {
            alert = $(".alert-warning");
            showHideAlert(alert);
            m_ofi_novo.ofi_novo = false;
        } else {
            Oficios.insert({
                abertura: dataBR_mongo(abertura),
                finalizacao: "",
                unidade: unidadeObj,
                feixe: feixe,
                oficio: oficio,
                status: status,
                operadora: operadoraObj,
                codigo: Number(codigo),
                tipo: tipo,
                criadoEm: dataEHora(),
                criadoPor: Meteor.user(),
                modificadoEm: dataEHora(),
                modificadoPor: Meteor.user(),
            });
            m_ofi_novo.ofi_novo = true;
            alert = $(".alert-success");
            showHideAlert(alert);
        };
    },
    'click #backNewOfi': function(event) {
        Modal.hide();
        m_ofi.m_codigo = "";
        m_ofi.m_oficio = "";
        m_ofi.m_feixe = "";
        m_ofi.m_tipo = "";
        m_ofi.m_status = "";
        m_ofi.m_operadora = "";
        m_ofi.m_abertura = "";
        m_ofi.m_finalizacao = "";
        m_ofi.m_unidade = "";
        Session.set('activeModal', "m_ofi");
        m_ofi_novo.ofi_novo = false;
    },

    'click #delRel': function(event) {
        Modal.hide();
        var p5 = PenalidadesP5.find({
            "relatorio._id": modals.modalId,
        }).fetch();
        if (p5) {
            for (var i5 = 0; i5 < p5.length; i5++) {
                PenalidadesP5.remove(p5[i5]._id);
            };
        };
        Relatorios.remove(modals.modalId);
        alert = $(".alert-info");
        showHideAlert(alert);
        m_rel.rel_novo = false;
    },
    'click #delRel2': function(event) {
        Modal.hide();
        var p5 = PenalidadesP5.find({
            "relatorio._id": modals.modalId,
        }).fetch();
        if (p5) {
            for (var i5 = 0; i5 < p5.length; i5++) {
                PenalidadesP5.remove(p5[i5]._id);
            };
        };
        Relatorios.remove(modals.modalId);
        Session.set('activeModal', 'm_rel');
        $("#bread_2").html("Relatórios");
        $("#bread_3").html("Manter Relatórios");
        m_rel.rel_novo = false;
    },
    'click #editRel': function(event) {
        Modal.hide();
        var data;
        var relStatus = "";
        var date = new Date();
        var dataAbertura = $("#inputDataAbertura").val();
        var dataVencimento = $("#inputDataVencimento").val();
        var dataFechamento = $("#inputDataFechamento").val();
        var cgcUnidade = $("#inputCGCUnidade").val();
        var titulo = $("#inputTitulo").val();
        var descricao = $("#inputDescricao").val();
        var operadora = $("#inputOperadora").val();
        var cgcUnidadeObj = Unidades.findOne({
            "unidade_name": cgcUnidade
        });
        var operadoraObj = Operadoras.findOne({
            "operadora_name": operadora
        });
        if (cgcUnidadeObj) {
            var relAntigo = Relatorios.findOne({
                dataAbertura: dataBR_mongo(dataAbertura),
                dataVencimento: dataBR_mongo(dataVencimento),
                cgcUnidade: cgcUnidadeObj,
                titulo: titulo,
                operadora: operadoraObj,
            });
            if (relAntigo && relAntigo._id != modals.modalId) {
                alert("Já existe uma outra fatura para a mesma Operadora, Unidade, Feixe e Mês/Ano. Favor verificar e tentar novamente.")
                m_rel.rel_novo = false;
            } else {
                if (dataFechamento != "" && dataFechamento != null) {
                    relStatus = "FINALIZADO";
                } else if (date > new Date(dataVencimento)) {
                    relStatus = "ATRASADO";
                } else {
                    relStatus = "EM ANDAMENTO";
                };
                if (dataBR_mongo(dataFechamento)) {
                    data = dataBR_mongo(dataFechamento);
                } else {
                    data = "";
                };
                Relatorios.update(modals.modalId, {
                    $set: {
                        dataAbertura: dataBR_mongo(dataAbertura),
                        dataVencimento: dataBR_mongo(dataVencimento),
                        dataFechamento: data,
                        cgcUnidade: cgcUnidadeObj,
                        titulo: titulo,
                        descricao: descricao,
                        status: relStatus,
                        operadora: operadoraObj,
                        modificadoEm: dataEHora(),
                        modificadoPor: Meteor.user(),
                    },
                });
                var p5 = PenalidadesP5.find({
                    "relatorio._id": modals.modalId,
                }).fetch();
                if (p5) {
                    for (var i5 = 0; i5 < p5.length; i5++) {
                        PenalidadesP5.remove(p5[i5]._id);
                    };
                };
                m_rel.rel_novo = true;
                alert = $(".alert-success");
                showHideAlert(alert);
            };
        } else {
            m_rel.rel_novo = false;
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
    },
    'click #backEditRel': function(event) {
        Modal.hide();
        m_rel.id = "";
        m_rel.m_dataAbertura = "";
        m_rel.m_dataVencimento = "";
        m_rel.m_dataFechamento = "";
        m_rel.m_cgcUnidade = "";
        m_rel.m_titulo = "";
        m_rel.m_descricao = "";
        m_rel.m_status = "";
        m_rel.m_operadora = "";
        Session.set('activeModal', "m_rel");
        m_rel.rel_novo = false;
    },
    'click #newRel': function(event) {
        Modal.hide();
        var date = new Date();
        var relStatus = "";
        var dataAbertura = $("#inputDataAbertura").val();
        var dataVencimento = $("#inputDataVencimento").val();
        var cgcUnidade = $("#inputCGCUnidade").val();
        var titulo = $("#inputTitulo").val();
        var descricao = $("#inputDescricao").val();
        var operadora = $("#inputOperadora").val();
        var cgcUnidadeObj = Unidades.findOne({
            "unidade_name": cgcUnidade
        });
        var operadoraObj = Operadoras.findOne({
            "operadora_name": operadora
        });
        if (cgcUnidadeObj) {
            var relAntigo = Relatorios.findOne({
                dataAbertura: dataBR_mongo(dataAbertura),
                dataVencimento: dataBR_mongo(dataVencimento),
                cgcUnidade: cgcUnidadeObj,
                titulo: titulo,
                operadora: operadoraObj,
            });
            if (relAntigo) {
                alert("Não é possível inserir dois ou mais relatórios para a mesma Operadora e Unidade contendo o mesmo Título, Data de Abertura e Data de Vencimento. Favor verificar e tentar novamente.");
                m_rel_novo.rel_novo = false;
            } else {
                if (date > new Date(dataVencimento)) {
                    relStatus = "ATRASADO";
                } else {
                    relStatus = "EM ANDAMENTO";
                };
                Relatorios.insert({
                    dataAbertura: dataBR_mongo(dataAbertura),
                    dataVencimento: dataBR_mongo(dataVencimento),
                    dataFechamento: "",
                    cgcUnidade: cgcUnidadeObj,
                    titulo: titulo,
                    descricao: descricao,
                    status: relStatus,
                    operadora: operadoraObj,
                    criadoEm: dataEHora(),
                    criadoPor: Meteor.user(),
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                });
                m_rel_novo.rel_novo = true;
                alert = $(".alert-success");
                showHideAlert(alert);
            };
        } else {
            m_rel_novo.rel_novo = false;
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
    },
    'click #backNewRel': function(event) {
        Modal.hide();
        m_rel.id = "";
        m_rel.m_dataAbertura = "";
        m_rel.m_dataVencimento = "";
        m_rel.m_dataFechamento = "";
        m_rel.m_cgcUnidade = "";
        m_rel.m_titulo = "";
        m_rel.m_descricao = "";
        m_rel.m_status = "";
        m_rel.m_operadora = "";
        Session.set('activeModal', "m_rel");
        m_rel_novo.rel_novo = false;
    },
    'click #delFat': function(event) {
        Modal.hide();
        var p1 = PenalidadesP1.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p1) {
            var oco, penalidades;
            for (var i1 = 0; i1 < p1.length; i1++) {
                oco = p1[i1].ocorrencia;
                penalidades = PenalidadesP1.find({
                    "ocorrencia._id": oco._id,
                });
                for (var p = 0; p < penalidades.length; p++) {
                    PenalidadesP1.remove(penalidades[p]._id);
                };
            };
        };
        var p2 = PenalidadesP2.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p2) {
            for (var i2 = 0; i2 < p2.length; i2++) {
                PenalidadesP2.remove(p2[i2]._id);
            };
        };
        var p3 = PenalidadesP3.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p3) {
            for (var i3 = 0; i3 < p3.length; i3++) {
                PenalidadesP3.remove(p3[i3]._id);
            };
        };
        var p5 = PenalidadesP5.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p5) {
            for (var i5 = 0; i5 < p5.length; i5++) {
                PenalidadesP5.remove(p5[i5]._id);
            };
        };
        Faturas.remove(modals.modalId);
        alert = $(".alert-info");
        showHideAlert(alert);
        a_fat.fat_nova = false;
    },
    'click #delFat2': function(event) {
        Modal.hide();
        var p1 = PenalidadesP1.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p1) {
            var oco, penalidades;
            for (var i1 = 0; i1 < p1.length; i1++) {
                oco = p1[i1].ocorrencia;
                penalidades = PenalidadesP1.find({
                    "ocorrencia._id": oco._id,
                });
                for (var p = 0; p < penalidades.length; p++) {
                    PenalidadesP1.remove(penalidades[p]._id);
                };
            };
        };
        var p2 = PenalidadesP2.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p2) {
            for (var i2 = 0; i2 < p2.length; i2++) {
                PenalidadesP2.remove(p2[i2]._id);
            };
        };
        var p3 = PenalidadesP3.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p3) {
            for (var i3 = 0; i3 < p3.length; i3++) {
                PenalidadesP3.remove(p3[i3]._id);
            };
        };
        var p5 = PenalidadesP5.find({
            "fatura._id": modals.modalId,
        }).fetch();
        if (p5) {
            for (var i5 = 0; i5 < p5.length; i5++) {
                PenalidadesP5.remove(p5[i5]._id);
            };
        };
        Faturas.remove(modals.modalId);
        Session.set('activeModal', 'a_fat');
        $("#bread_2").html("Administrar");
        $("#bread_3").html("Faturas");
        a_fat.fat_nova = false;
    },
    'click #editFat': function(event) {
        Modal.hide();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var operadora = $("#inputOperadora").val();
        var mesAno = $("#inputMesAno").val();
        var valor = $("#inputValor").val();
        var unidadeObj = Unidades.findOne({
            "unidade_name": unidade
        });
        var operadoraObj = Operadoras.findOne({
            "operadora_name": operadora
        });
        var mesAno_mongo = monthYearBR(mesAno);
        var faturaAntiga = Faturas.findOne({
            operadora: operadoraObj,
            mesAno: mesAno_mongo,
            unidade: unidadeObj,
            feixe: feixe
        });
        if (faturaAntiga && faturaAntiga._id != modals.modalId) {
            alert("Já existe uma outra fatura para a mesma Operadora, Unidade, Feixe e Mês/Ano. Favor verificar e tentar novamente.")
            a_fat.fat_nova = false;
        } else {
            valor = valor.replace("R$", "");
            valor = valor.replace(".", "");
            valor = Number(valor.replace(",", "."));
            var valor_mongo = numeral(valor).format('$0,0.00');
            Faturas.update(modals.modalId, {
                $set: {
                    unidade: unidadeObj,
                    feixe: feixe,
                    operadora: operadoraObj,
                    mesAno: mesAno_mongo,
                    valor: valor_mongo,
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
            var p1 = PenalidadesP1.find({
                "fatura._id": modals.modalId,
            }).fetch();
            if (p1) {
                var oco, penalidades;
                for (var i1 = 0; i1 < p1.length; i1++) {
                    oco = p1[i1].ocorrencia;
                    penalidades = PenalidadesP1.find({
                        "ocorrencia._id": oco._id,
                    });
                    for (var p = 0; p < penalidades.length; p++) {
                        PenalidadesP1.remove(penalidades[p]._id);
                    };
                };
            };
            var p2 = PenalidadesP2.find({
                "fatura._id": modals.modalId,
            }).fetch();
            if (p2) {
                for (var i2 = 0; i2 < p2.length; i2++) {
                    PenalidadesP2.remove(p2[i2]._id);
                };
            };
            var p3 = PenalidadesP3.find({
                "fatura._id": modals.modalId,
            }).fetch();
            if (p3) {
                for (var i3 = 0; i3 < p3.length; i3++) {
                    PenalidadesP3.remove(p3[i3]._id);
                };
            };
            var p5 = PenalidadesP5.find({
                "fatura._id": modals.modalId,
            }).fetch();
            if (p5) {
                for (var i5 = 0; i5 < p5.length; i5++) {
                    PenalidadesP5.remove(p5[i5]._id);
                };
            };
            a_fat.fat_nova = true;
            alert = $(".alert-success");
            showHideAlert(alert);
        };
    },
    'click #backEditFat': function(event) {
        Modal.hide();
        a_fat.id = "";
        a_fat.fat_operadora = "";
        a_fat.fat_mesAno = "";
        a_fat.fat_mes = "";
        a_fat.fat_ano = "";
        a_fat.fat_unidade = "";
        a_fat.fat_feixe = "";
        a_fat.fat_valor = "";
        a_fat.fat_nova = false;
        Session.set('activeModal', "a_fat");
    },
    'click #newFat': function(event) {
        Modal.hide();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var operadora = $("#inputOperadora").val();
        var mesAno = $("#inputMesAno").val();
        var valor = $("#inputValor").val();
        var unidadeObj = Unidades.findOne({
            "unidade_name": unidade
        });
        var operadoraObj = Operadoras.findOne({
            "operadora_name": operadora
        });
        var mesAno_mongo = monthYearBR(mesAno);
        var faturaAntiga = Faturas.findOne({
            operadora: operadoraObj,
            mesAno: mesAno_mongo,
            unidade: unidadeObj,
            feixe: feixe,
        });
        if (faturaAntiga) {
            alert("Não é possível inserir duas ou mais faturas para a mesma Operadora, Unidade, Feixe e Mês/Ano. Favor verificar e tentar novamente.");
            a_fat.fat_nova = false;
        } else {
            valor = valor.replace("R$", "");
            valor = valor.replace(".", "");
            valor = Number(valor.replace(",", "."));
            if (feixe == "" || feixe == null) {
                feixe = "";
            };
            Faturas.insert({
                operadora: operadoraObj,
                mesAno: mesAno_mongo,
                unidade: unidadeObj,
                feixe: feixe,
                valor: numeral(valor).format('$0,0.00'),
                criadoEm: dataEHora(),
                criadoPor: Meteor.user(),
                modificadoEm: dataEHora(),
                modificadoPor: Meteor.user(),
            }, );
            a_fat.fat_nova = true;
            alert = $(".alert-success");
            showHideAlert(alert);
        };
    },
    'click #backNewFat': function(event) {
        Modal.hide();
        a_fat.id = "";
        a_fat.fat_operadora = "";
        a_fat.fat_mesAno = "";
        a_fat.fat_mes = "";
        a_fat.fat_ano = "";
        a_fat.fat_unidade = "";
        a_fat.fat_feixe = "";
        a_fat.fat_valor = "";
        a_fat.fat_nova = false;
        Session.set('activeModal', "a_fat");
    },
    'click #editPar': function(event) {
        Modal.hide();
        var p1F1_EA = $("#p1_fatorEA_1_input").val();
        var p1F2_EA = $("#p1_fatorEA_2_input").val();
        var p1F1_O = $("#p1_fatorO_1_input").val();
        var p1F2_O = $("#p1_fatorO_2_input").val();
        var p2F1_EA = $("#p2_fatorEA_1_input").val();
        var p2F2_EA = $("#p2_fatorEA_2_input").val();
        var p2F1_O = $("#p2_fatorO_1_input").val();
        var p2F2_O = $("#p2_fatorO_2_input").val();
        var p3F1_EA = $("#p3_fatorEA_1_input").val();
        var p3F2_EA = $("#p3_fatorEA_2_input").val();
        var p3F1_O = $("#p3_fatorO_1_input").val();
        var p3F2_O = $("#p3_fatorO_2_input").val();
        var p4F1_EA = $("#p4_fatorEA_1_input").val();
        var p4F2_EA = $("#p4_fatorEA_2_input").val();
        var p4F1_O = $("#p4_fatorO_1_input").val();
        var p4F2_O = $("#p4_fatorO_2_input").val();
        var p5F_EA = $("#p5_fatorEA_input").val();
        var p5F_O = $("#p5_fatorO_input").val();
        Parametros.update(modals.modalId, {
            $set: {
                p1F1_EA: numeral(p1F1_EA).format('0.00'),
                p1F2_EA: numeral(p1F2_EA).format('0.00'),
                p1F1_O: numeral(p1F1_O).format('0.00'),
                p1F2_O: numeral(p1F2_O).format('0.00'),
                p2F1_EA: numeral(p2F1_EA).format('0.00'),
                p2F2_EA: numeral(p2F2_EA).format('0.00'),
                p2F1_O: numeral(p2F1_O).format('0.00'),
                p2F2_O: numeral(p2F2_O).format('0.00'),
                p3F1_EA: numeral(p3F1_EA).format('0.00'),
                p3F2_EA: numeral(p3F2_EA).format('0.00'),
                p3F1_O: numeral(p3F1_O).format('0.00'),
                p3F2_O: numeral(p3F2_O).format('0.00'),
                p4F1_EA: numeral(p4F1_EA).format('0.00'),
                p4F2_EA: numeral(p4F2_EA).format('0.00'),
                p4F1_O: numeral(p4F1_O).format('0.00'),
                p4F2_O: numeral(p4F2_O).format('0.00'),
                p5F_EA: numeral(p5F_EA).format('0.00'),
                p5F_O: numeral(p5F_O).format('0.00'),
                modificadoEm: dataEHora(),
                modificadoPor: Meteor.user(),
            },
        });
        alert = $(".alert-success");
        showHideAlert(alert);
    },
    'click #delUsu': function(event) {
        Modal.hide();
        Meteor.users.remove(modals.modalId);
        alert = $(".alert-info");
        showHideAlert(alert);
        a_usu.usu_novo = false;
    },
    'click #delUsu2': function(event) {
        Modal.hide();
        Meteor.users.remove(modals.modalId);
        Session.set('activeModal', 'a_usu');
        $("#bread_2").html("Administrar");
        $("#bread_3").html("Usuários");
        a_usu.usu_novo = false;
    },
    'click #newUser': function(event) {
        Modal.hide();
        var matricula = $("#findMatricula").val();
        var nome = $("#findNome").val();
        var perfil = $("#findPerfil").val();
        var unidade = $("#findUnidade").val();
        var pass1 = $("#findSenha1").val();
        status = addUsuario(matricula, nome, pass1, unidade, perfil);
        if (status) {
            alert = $(".alert-success");
            showHideAlert(alert);
            a_usu.usu_novo = true;
        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);
            a_usu.usu_novo = false;
        };
    },
    'click #backNewUsu': function(event) {
        Modal.hide();
        a_usu.usu_id = "";
        a_usu.usu_matricula = "";
        a_usu.usu_nome = "";
        a_usu.usu_unidade = "";
        a_usu.usu_perfil = "";
        Session.set('activeModal', "a_usu");
        a_usu.usu_novo = false;
    },
    'click #editUsu': function(event) {
        Modal.hide();
        var perfil = $("#findPerfil").val();
        var unidade = $("#findUnidade").val();
        var unidadeObj = Unidades.findOne({
            "unidade_name": unidade,
        });
        var perfilObj = Perfis.findOne({
            "perfil_nome": perfil,
        });
        if (!unidadeObj) {
            alert = $(".alert-warning");
            showHideAlert(alert);
            a_usu.usu_novo = false;
        } else {
            Meteor.users.update(modals.modalId, {
                $set: {
                    "profile.unidade": unidadeObj,
                    "profile.perfil": perfilObj,
                    "profile.modificadoEm": dataEHora(),
                    "profile.modificadoPor": Meteor.user(),
                },
            });
            alert = $(".alert-success");
            showHideAlert(alert);
            a_usu.usu_novo = true;
        };
    },
    'click #backEditUsu': function(event) {
        Modal.hide();
        a_usu.usu_id = "";
        a_usu.usu_matricula = "";
        a_usu.usu_nome = "";
        a_usu.usu_unidade = "";
        a_usu.usu_perfil = "";
        Session.set('activeModal', "a_usu");
        a_usu.usu_novo = false;
    },
    'click #import': function(event) {
        var tipo = $('#inputTipo').val();
        var q = 0;
        var x = 0;
        var fileInput = document.getElementById('inputFile');
        var file = fileInput.files[0];
        var files = fileInput.files;
        var i, f, fi;
        var today = dataJS_BR(new Date());
        var dia, mes, ano, anoAux, temp, hora, minutos;
        var reader, name, data, workbook, sheet_name_list, worksheet,fileImport;
        var reg, tipo, feixe, codigo, oficio, unidade, operadora, abertura, temp, aberturaBR;
        var finalizacao, finalizacaoBR, operadoraObj, unidadeObj, oficioAntigo;
        $(".progress").show();
        if (tipo == "SITEL") {
            for (i = 0, f = files[i]; i != files.length; ++i) {
                reader = new FileReader();
                name = f.name;
                reader.onload = function(e) {
                    data = e.target.result;
                    workbook = xlsx.read(data, {
                        type: 'binary'
                    });
                    sheet_name_list = workbook.SheetNames;
                    if (sheet_name_list.indexOf("DIGITAL") == 0 && sheet_name_list.indexOf("ANALOGICO") == 1) {
                        sheet_name_list.forEach(function(y) { /* iterate through sheets */
                            worksheet = workbook.Sheets[y];
                            if (y == "DIGITAL" || y == "ANALOGICO") {
                                fileImport = xlsx.utils.sheet_to_json(worksheet);
                                for (fi = 0; fi < fileImport.length; fi++) {
                                    x++;
                                    reg = fileImport[fi];
                                    tipo = reg["TIPO"];
                                    feixe = "";
                                    if (y == "ANALOGICO") {
                                        feixe = "ANALÓGICO";
                                    } else {
                                        feixe = y;
                                    }
                                    codigo = Number(reg["CÓD."]);
                                    oficio = reg["OFÍCIO"];
                                    unidade = reg["UNIDADE"];
                                    operadora = reg["OPERADORA"];
                                    abertura = new Date(reg["DT OFICIO"]);
                                    dia = abertura.getDate();
                                    mes = Number(abertura.getMonth()) + 1;
                                    anoAux = Number(abertura.getYear());
                                    if (anoAux > 100) {
                                        ano = 2000 + anoAux - 100;
                                    } else {
                                        ano = 2000 + anoAux;
                                    };
                                    temp = new Date(ano + "/" + mes + "/" + dia);
                                    aberturaBR = dateBR(temp);
                                    if (reg["DT FINALIZAÇÃO"] != "" && reg["DT FINALIZAÇÃO"] != undefined) {
                                        finalizacao = new Date(reg["DT FINALIZAÇÃO"]);
                                        dia = finalizacao.getDate();
                                        mes = Number(finalizacao.getMonth()) + 1;
                                        anoAux = Number(finalizacao.getYear());
                                        if (anoAux > 100) {
                                            ano = 2000 + anoAux - 100;
                                        } else {
                                            ano = 2000 + anoAux;
                                        };
                                        finalizacaoBR = dateBR(temp);
                                    } else {
                                        finalizacaoBR = "";
                                    };
                                    oficioAntigo = Oficios.findOne({
                                        feixe: feixe,
                                        codigo: codigo,
                                        oficio: oficio,
                                    });
                                    unidadeObj = Unidades.findOne({
                                        unidade_name_sitel: unidade,
                                    });
                                    if (!oficioAntigo && unidadeObj != undefined && unidadeObj != "undefined" && unidadeObj != "") {
                                        operadoraObj = Operadoras.findOne({
                                            operadora_name: operadora,
                                        });
                                        Oficios.insert({
                                            feixe: feixe,
                                            codigo: codigo,
                                            oficio: oficio,
                                            tipo: tipo,
                                            unidade: unidadeObj,
                                            operadora: operadoraObj,
                                            status: "SOLICITADO",
                                            abertura: aberturaBR,
                                            finalizacao: finalizacaoBR,
                                            criadoEm: dataEHora(),
                                            criadoPor: Meteor.user(),
                                            modificadoEm: dataEHora(),
                                            modificadoPor: Meteor.user(),
                                        });
                                        q++;
                                    };
                                    // var pro = x / fileImport.length;
                                    // var width = pro * 100 + "%";
                                    // var aux = String(pro.toFixed(3));
                                    // modals.pro = pro * 100;
                                    // modals.width = width;
                                    // $(".progress-bar").css("width", width);
                                    // $(".progress-bar").html(pro * 100 + "%");
                                };
                            };
                        });
                        if (q > 0) {
                            $("#reg").text(q);
                            alert = $(".alert-success");
                            showHideAlert(alert);
                            Modal.hide();
                        } else {
                            alert = $(".alert-info");
                            showHideAlert(alert);
                            Modal.hide();
                        };
                    } else {
                        alert = $(".alert-warning");
                        showHideAlert(alert);
                        Modal.hide();
                    };
                };
                reader.readAsBinaryString(f);
            };
        } else if (tipo == "OCORRÊNCIAS") {
            $(".progress").show();
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = xlsx.read(data, {
                        type: 'binary'
                    });
                    var sheet_name_list = workbook.SheetNames;
                    if (sheet_name_list.indexOf("Relatorio") == 0) {
                        var reg, cgc, ddd, unidade, unidadeObj, chave, chaveNova;
                        var operadora, operadoraObj, abertura, fechamento, chamado;
                        var contrato, statusOcorrencia, tempo, ocorrenciaAntiga;
                        var dia, mes, ano, anoAux, horas, minutos, temp;
                        sheet_name_list.forEach(function(y) { /* iterate through sheets */
                            var worksheet = workbook.Sheets[y];
                            var fileImport = xlsx.utils.sheet_to_json(worksheet);
                            for (var fi = 0; fi < fileImport.length; fi++) {
                                x++;
                                reg = fileImport[fi];
                                chamado = reg['T001_NU_CHAMADO_OP'];
                                contrato = reg['T001_NU_CONTRATO'];
                                ocorrenciaAntiga = Ocorrencias.findOne({
                                    "chamado": chamado,
                                    "contrato": contrato,
                                });
                                if (!ocorrenciaAntiga) {
                                    cgc = reg['CGC_UNID'];
                                    ddd = reg['DDD_CHAVE'];
                                    unidade = reg['NOME'];
                                    chave = reg['NUM_CHAVE'];
                                    operadora = reg['OPERADORA'];
                                    abertura = new Date(reg['T001_DT_ABERTURA']);
                                    dia = abertura.getDate();
                                    mes = Number(abertura.getMonth()) + 1;
                                    anoAux = Number(abertura.getYear());
                                    if (anoAux > 100) {
                                        ano = 2000 + anoAux - 100;
                                    } else {
                                        ano = 2000 + anoAux;
                                    };
                                    horas = Number(abertura.getHours());
                                    minutos = Number(abertura.getMinutes());
                                    temp = new Date(ano + "/" + mes + "/" + dia + " " + horas + ":" + minutos + ":00");
                                    var aberturaBR = dateBR_full(temp);
                                    fechamento = new Date(reg['T001_DT_FECHAMENTO']);
                                    dia = fechamento.getDate();
                                    mes = Number(fechamento.getMonth()) + 1;
                                    anoAux = Number(fechamento.getYear());
                                    if (anoAux > 100) {
                                        ano = 2000 + anoAux - 100;
                                    } else {
                                        ano = 2000 + anoAux;
                                    };
                                    horas = Number(fechamento.getHours());
                                    minutos = Number(fechamento.getMinutes());
                                    temp = new Date(ano + "/" + mes + "/" + dia + " " + horas + ":" + minutos + ":00");
                                    var fechamentoBR = dateBR_full(temp);
                                    chamado = reg['T001_NU_CHAMADO_OP'];
                                    contrato = reg['T001_NU_CONTRATO'];
                                    tempo = reg['TEMPO_MINUTOS'];
                                    chaveNova = "(" + ddd + ") " + chave.substring(0, 4) + "-" + chave.substring(4, 8);
                                    operadoraObj = Operadoras.findOne({
                                        "operadora_name": operadora,
                                    });
                                    unidadeObj = Unidades.findOne({
                                        "unidade_name_sitel": unidade,
                                    });
                                    if (fechamento != null && fechamento != "") {
                                        statusOcorrencia = "FINALIZADO";
                                    } else {
                                        statusOcorrencia = "SOLICITADO";
                                    };
                                    Ocorrencias.insert({
                                        chamado: chamado,
                                        contrato: contrato,
                                        chave: chaveNova,
                                        abertura: aberturaBR,
                                        fechamento: fechamentoBR,
                                        responsabilidade: "OPERADORA",
                                        tempo: numeral(tempo).format('0,0.00'),
                                        unidade: unidadeObj,
                                        operadora: operadoraObj,
                                        status: statusOcorrencia,
                                        descricao: "",
                                        criadoEm: dataEHora(),
                                        criadoPor: Meteor.user(),
                                        modificadoEm: dataEHora(),
                                        modificadoPor: Meteor.user(),
                                    });
                                    q++;
                                };
                                // var pro = x / fileImport.length;
                                // var width = pro * 100 + "%";
                                // var aux = String(pro.toFixed(3));
                                // modals.pro = pro * 100;
                                // modals.width = width;
                                // $(".progress-bar").css("width", width);
                                // $(".progress-bar").html(pro * 100 + "%");
                            };
                        });
                        if (q > 0) {
                            $("#reg").text(q);
                            alert = $(".alert-success");
                            showHideAlert(alert);
                            Modal.hide();
                        } else {
                            alert = $(".alert-info");
                            showHideAlert(alert);
                            Modal.hide();
                        };
                    } else {
                        alert = $(".alert-warning");
                        showHideAlert(alert);
                        Modal.hide();
                    };
                };
                reader.readAsBinaryString(f);
            };
        } else if (tipo == "UNIDADES") {
            $(".progress").show();
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = xlsx.read(data, {
                        type: 'binary'
                    });
                    var sheet_name_list = workbook.SheetNames;
                    if (sheet_name_list.indexOf("UNIDADES") == 0) {
                        sheet_name_list.forEach(function(y) {
                            var worksheet = workbook.Sheets[y];
                            if (y == "UNIDADES") {
                                var hoje = new Date();
                                var fileImport = xlsx.utils.sheet_to_json(worksheet);
                                for (var fi = 0; fi < fileImport.length; fi++) {
                                    x++;
                                    var reg = fileImport[fi];
                                    var nome = reg["unidade_name"];
                                    var sitel = reg["unidade_name_sitel"];
                                    var unidadeAntiga = Unidades.findOne({
                                        unidade_name: nome,
                                        unidade_name_sitel: sitel,
                                    });
                                    if (!unidadeAntiga) {
                                        Unidades.insert({
                                            unidade_name: nome,
                                            unidade_name_sitel: sitel,
                                            criadoEm: dateFormat(hoje, "dd/mm/yyyy HH:MM:ss"),
                                            criadoPor: Meteor.user(),
                                            modificadoEm: dateFormat(hoje, "dd/mm/yyyy HH:MM:ss"),
                                            modificadoPor: Meteor.user(),
                                        });
                                        q++;
                                    };
                                    // var pro = x / fileImport.length;
                                    // var width = pro * 100 + "%";
                                    // var aux = String(pro.toFixed(3));
                                    // modals.pro = pro * 100;
                                    // modals.width = width;
                                    // $(".progress-bar").css("width", width);
                                    // $(".progress-bar").html(pro * 100 + "%");
                                };
                            };
                        });
                        if (q > 0) {
                            $("#reg").text(q);
                            alert = $(".alert-success");
                            showHideAlert(alert);
                            Modal.hide();
                        } else {
                            alert = $(".alert-info");
                            showHideAlert(alert);
                            Modal.hide();
                        };
                    } else {
                        alert = $(".alert-warning");
                        showHideAlert(alert);
                        Modal.hide();
                    };
                };
                reader.readAsBinaryString(f);
            };
        };
    },
});

////////////////////////////////////////////////////////////////////////////////

var penalidades_data = [{
    p_name: "P1",
    p_description: "Penalidade P1"
}, {
    p_name: "P2",
    p_description: "Penalidade P2"
}, {
    p_name: "P3",
    p_description: "Penalidade P3"
}, {
    p_name: "P4",
    p_description: "Penalidade P4"
}, {
    p_name: "P5",
    p_description: "Penalidade P5"
}, ];

var logo = {
    logo_src: "logocaixa.gif",
    logo_alt: "Caixa Econômica Federal Logo",
    logo_ref: "#",
    logo_title: "SIPET",
    logo_description: "Sistema de Penalidades de Telefonia"
};

Template.header.helpers(logo);

////////////////////////////////////////////////////////////////////////////////

var bread = {
    principal: "Principal",
    principal_href: "a_inicio",
    primario: "Página Inicial",
    secundario: "",
}

Template.bread.helpers(bread);

Template.bread.events({
    'click #bread_inicio': function(event) {
        Session.set('activeModal', bread.principal_href);
        $("#bread_2").html(bread.primario);
        $("#bread_3").html(bread.secundario);
    },
});

////////////////////////////////////////////////////////////////////////////////

var menu_data_novo = [{
    m_name: "Ocorrências",
    menu_item: [{
        m_index: false,
        m_item: "Manter Ocorrências",
        m_href: "m_oco",
        m_bread: ["Principal", "Ocorrências", "Manter Ocorrências"],
        m_description: "CRUD Ocorrências",
    }]
}, {
    m_name: "Ofícios",
    menu_item: [{
        m_index: false,
        m_item: "Manter Ofícios",
        m_href: "m_ofi",
        m_bread: ["Principal", "Ofícios", "Manter Ofícios"],
        m_description: "CRUD Ofícios",
    }]
}, {
    m_name: "Relatórios",
    menu_item: [{
        m_index: false,
        m_item: "Manter Relatórios",
        m_href: "m_rel",
        m_bread: ["Principal", "Relatórios", "Manter Relatórios"],
        m_description: "CRUD Relatórios",
    }]
}, {
    m_name: "Penalidades",
    menu_item: [{
        m_index: true,
        m_item: "P1",
        m_href: "c_p1",
        m_bread: ["Principal", "Penalidades", "P1"],
        m_description: "Elaborar Penalidades de Disponibilidade Mensal",
    }, {
        m_index: true,
        m_item: "P2",
        m_href: "c_p2",
        m_bread: ["Principal", "Penalidades", "P2"],
        m_description: "Elaborar Penalidades de Prazo de Recuperação de Serviço",
    }, {
        m_index: true,
        m_item: "P3",
        m_href: "c_p3",
        m_bread: ["Principal", "Penalidades", "P3"],
        m_description: "Elaborar Penalidades de Interrupção de Serviço",
    }, {
        m_index: true,
        m_item: "P4",
        m_href: "c_p4",
        m_bread: ["Principal", "Penalidades", "P4"],
        m_description: "Elaborar Penalidades de Atraso de Instalação, Alteração de Configuração, Ampliação da Rede",
    }, {
        m_index: false,
        m_item: "P5",
        m_href: "c_p5",
        m_bread: ["Principal", "Penalidades", "P5"],
        m_description: "Elaborar Penalidades de Disponibilidade Mensal",
    }]
}, {
    m_name: "Administrar",
    menu_item: [{
        m_index: true,
        m_item: "Importar",
        m_href: "a_imp",
        m_bread: ["Principal", "Administrar", "Importar"],
        m_description: "Importar Arquivos",
    }, {
        m_index: true,
        m_item: "Faturas",
        m_href: "a_fat",
        m_bread: ["Principal", "Administrar", "Faturas"],
        m_description: "CRUD Faturas",
    }, {
        m_index: true,
        m_item: "Parâmetros Penalidades",
        m_href: "a_par",
        m_bread: ["Principal", "Administrar", "Parâmetros"],
        m_description: "CRUD Parâmetros",
    }, {
        m_index: false,
        m_item: "Usuários",
        m_href: "a_usu",
        m_bread: ["Principal", "Administrar", "Usuários"],
        m_description: "CRUD Usuários",
    }]
}];

var menu_data_oco = [{
    m_name: "Ocorrências",
    menu_item: [{
        m_index: false,
        m_item: "Manter Ocorrências",
        m_href: "m_oco",
        m_bread: ["Principal", "Ocorrências", "Manter Ocorrências"],
        m_description: "CRUD Ocorrências",
    }]
}, {
    m_name: "Penalidades",
    menu_item: [{
        m_index: true,
        m_item: "P1",
        m_href: "c_p1",
        m_bread: ["Principal", "Penalidades", "P1"],
        m_description: "Elaborar Penalidades de Disponibilidade Mensal",
    }, {
        m_index: true,
        m_item: "P2",
        m_href: "c_p2",
        m_bread: ["Principal", "Penalidades", "P2"],
        m_description: "Elaborar Penalidades de Prazo de Recuperação de Serviço",
    }, {
        m_index: false,
        m_item: "P3",
        m_href: "c_p3",
        m_bread: ["Principal", "Penalidades", "P3"],
        m_description: "Elaborar Penalidades de Interrupção de Serviço",
    }]
}, {
    m_name: "Administrar",
    menu_item: [{
        m_index: true,
        m_item: "Importar",
        m_href: "a_imp",
        m_bread: ["Principal", "Administrar", "Importar"],
        m_description: "Importar Arquivos",
    }, {
        m_index: false,
        m_item: "Faturas",
        m_href: "a_fat",
        m_bread: ["Principal", "Administrar", "Faturas"],
        m_description: "CRUD Faturas",
    }]
}];

var menu_data_ofi = [{
    m_name: "Ofícios",
    menu_item: [{
        m_index: false,
        m_item: "Manter Ofícios",
        m_href: "m_ofi",
        m_bread: ["Principal", "Ofícios", "Manter Ofícios"],
        m_description: "CRUD Ofícios",
    }]
}, {
    m_name: "Relatórios",
    menu_item: [{
        m_index: false,
        m_item: "Manter Relatórios",
        m_href: "m_rel",
        m_bread: ["Principal", "Relatórios", "Manter Relatórios"],
        m_description: "CRUD Relatórios",
    }]
}, {
    m_name: "Penalidades",
    menu_item: [{
        m_index: true,
        m_item: "P4",
        m_href: "c_p4",
        m_bread: ["Principal", "Penalidades", "P4"],
        m_description: "Elaborar Penalidades de Atraso de Instalação, Alteração de Configuração, Ampliação da Rede",
    }, {
        m_index: false,
        m_item: "P5",
        m_href: "c_p5",
        m_bread: ["Principal", "Penalidades", "P5"],
        m_description: "Elaborar Penalidades de Disponibilidade Mensal",
    }]
}, {
    m_name: "Administrar",
    menu_item: [{
        m_index: true,
        m_item: "Importar",
        m_href: "a_imp",
        m_bread: ["Principal", "Administrar", "Importar"],
        m_description: "Importar Arquivos",
    }, {
        m_index: false,
        m_item: "Faturas",
        m_href: "a_fat",
        m_bread: ["Principal", "Administrar", "Faturas"],
        m_description: "CRUD Faturas",
    }, ]
}];

var menu = function() {
    if (Meteor.user().profile.perfil.perfil_nome == "ADMIN" || Meteor.user().profile.perfil.perfil_nome == "AUDITORIA ADMIN") {
        return menu_data_novo;
    } else if (Meteor.user().profile.perfil.perfil_nome == "OCORRENCIA" || Meteor.user().profile.perfil.perfil_nome == "AUDITORIA OCORRENCIA") {
        return menu_data_oco;
    } else {
        return menu_data_ofi;
    };
};

Template.menu.helpers({
    menu: menu,
    menu_item: menu.menu_item,
});

Template.menu.events({
    'click #Penalidades': function(event) {
        var menu = $(event.target).attr("id");
        var item = $(event.target).text();
        var href = $(event.target).attr("data-page");
        var p = href.substring(2, 4).toUpperCase();
        switch (p) {
            case 'P1':
                P1();
                break;
            case 'P2':
                P2();
                break;
            case 'P3':
                P3();
                break;
            case 'P4':
                P4();
                break;
            case 'P5':
                P5();
                break;
        };
        // $("#bread_2").html(menu);
        // $("#bread_3").html(item);
        Session.set('activeModal', href);
    },
    'click .js-click': function(event) {
        var menu = $(event.target).attr("id");
        var item = $(event.target).text();
        var href = $(event.target).attr("data-page");
        // $("#bread_2").html(menu);
        // $("#bread_3").html(item);
        Session.set('activeModal', href);
    },
});

Template.menu.rendered = function() {
    $(".menu_item").mouseover(function() {
        $(this).click();
        $(this).css('text-decoration', 'underline');
    });
    $(".menu_item").mouseout(function() {
        $(this).css('text-decoration', 'none');
    });
    $(".sub_item").mouseover(function() {
        $(this).css('text-decoration', 'underline');
    });
    $(".sub_item").mouseout(function() {
        $(this).css('text-decoration', 'none');
    });
    $(".dropdown-menu").mouseleave(function() {
        $(this).parent().click();
    });
};

////////////////////////////////////////////////////////////////////////////////

var date = new Date();
var today = dataJS_BR(new Date());
var horas = date.getHours();
var minutos = date.getMinutes();
var segundos = date.getSeconds();
var diaSemana = date.getDay();
var tempo = horas + ":" + minutos + ":" + segundos;
var secao = dataBR_mongo(today) + ",    " + tempo;
if (diaSemana == 0) {
    secao = "Domingo " + secao;
} else if (diaSemana == 1) {
    secao = "Segunda-Feira " + secao;
} else if (diaSemana == 2) {
    secao = "Terça-Feira " + secao;
} else if (diaSemana == 3) {
    secao = "Quarta-Feira " + secao;
} else if (diaSemana == 4) {
    secao = "Quinta-Feira " + secao;
} else if (diaSemana == 5) {
    secao = "Sexta-Feira " + secao;
} else if (diaSemana == 6) {
    secao = "Sábado " + secao;
};

var session = {
    agora: secao,
    username: function() {
        var name = Meteor.user().profile.nome;
        return name.toUpperCase();
    },
    sair_description: "Clique para sair",
    info_description: "Clique para mais informações",
    pass_form: "pass_form",
    id: function() {
        return Meteor.user()._id;
    },
    usuario: "",
    matricula: "",
    perfil: "",
    unidade: "",
    lastSeen: "",
};
Template.session.helpers(session);

Template.info.helpers({
    session: session,
    isUserAdmin: function(){
        var admin = false;
        if (Meteor.user().usename == "admin"){
            admin = true;
        };
        return admin;
    },
});

Template.info.rendered = function() {
    $(".passInfo").hide();
    $(".okInfo").hide();
    $(".errorInfo").hide();
};

Template.info.events({
    'click #changePass': function(event) {
        $(".passInfo").hide();
        $(".okInfo").hide();
        $(".errorInfo").hide();
        var alert;
        var id = Meteor.user()._id;
        var username = Meteor.user().username;
        var newPassword = $("#pass").val();
        var newPasswordValidation = $("#passValidation").val();
        if (newPassword.length < 6) {
            alert = $(".errorInfo");
            showHideAlert(alert);
            return false;
        }
        if (newPassword != newPasswordValidation) {
            alert = $(".passInfo");
            showHideAlert(alert);
            return false;
        };
        Meteor.call('setPass', id, newPassword);
        alert = $(".okInfo");
        showHideAlert(alert);
        Meteor.loginWithPassword({
            username: username
        }, newPassword, function(err) {
            if (err) {
                alert = $(".alert-danger");
                showHideAlert(alert);
                var user = Meteor.users.findOne({
                    "username": username,
                });
                if (user) {
                    userFailure(user._id);
                };
            } else {
                var user = Meteor.user();
                userSuccess(user._id);
                Modal.hide();
            };
        });
    },
});

Template.session.events({
    'click #btnSessionSair': function(event) {
        event.preventDefault();
        Meteor.logout();
    },
    'click #btnSessionInfo': function(event) {
        session.usuario = Meteor.user().profile.nome;
        session.matricula = Meteor.user().username;
        session.perfil = Meteor.user().profile.perfil.perfil_nome;
        session.unidade = Meteor.user().profile.unidade.unidade_name;
        session.lastSeen = Meteor.user().profile.ultimoSucessoEm;
        Modal.show("info");
    },
});

////////////////////////////////////////////////////////////////////////////////

var passAux = {
    username: "",
    id: "",
};

Template.pass.rendered = function() {
    $(".passInfo").hide();
    $(".okInfo").hide();
    $(".errorInfo").hide();
};

Template.pass.events({
    'click #changePass': function(event) {
        $(".passInfo").hide();
        $(".okInfo").hide();
        $(".errorInfo").hide();
        var alert;
        var id = passAux.id;
        var username = passAux.username;
        var newPassword = $("#pass1").val();
        var newPasswordValidation = $("#pass1Validation").val();
        if (newPassword.length < 6) {
            alert = $(".errorInfo");
            showHideAlert(alert);
            return false;
        };
        if (newPassword != newPasswordValidation) {
            alert = $(".passInfo");
            showHideAlert(alert);
            return false;
        };
        Meteor.call('setPass', id, newPassword);
        alert = $(".okInfo");
        showHideAlert(alert);
        Meteor.loginWithPassword({
            username: username
        }, newPassword, function(err) {
            if (err) {
                alert = $(".alert-danger");
                showHideAlert(alert);
                var user = Meteor.users.findOne({
                    "username": username,
                });
                if (user) {
                    userFailure(user._id);
                };
            } else {
                var user = Meteor.user();
                userSuccess(user._id);
                Session.set('activeModal', 'a_inicio')
                Modal.hide();
            };
        });
    },
});


////////////////////////////////////////////////////////////////////////////////

Template.modal.helpers({
    activeModal: function() {
        return Session.get('activeModal');
    }
});

////////////////////////////////////////////////////////////////////////////////

var a_log = {
    log_form: "login_form",
    log_login: "login",
    log_title: "Entrar"
};

Template.a_log.helpers({
    a_log: a_log,
});

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

function dataEHora() {
    var agora = new Date();
    return dateFormat(agora, "dd/mm/yyyy HH:MM:ss");
}

function userSuccess(id) {
    var user = Meteor.users.findOne({
        _id: id,
    });
    Meteor.users.update(user._id, {
        $set: {
            "profile.ultimoSucessoEm": dataEHora(),
        },
    });
};

function userFailure(id) {
    var user = Meteor.users.findOne({
        _id: id,
    });
    Meteor.users.update(user._id, {
        $set: {
            "profile.ultimoFracassoEm": dataEHora(),
        },
    });
};

Template.a_log.events({
    'submit form': function(event) {
        $(".alert-danger").hide();
        event.preventDefault();
        var username = $("#inputMatricula").val();
        var pass = $("#inputSenha").val();
        // if (username == "admin" || username == "aadmin" || username == "ocorrencia" || username == "aocorrencia" || username == "oficio" || username == "aoficio" ) {
        var user = Meteor.users.findOne({
            "username": username
        });
        if (user) {
            if (user.profile.ultimoSucessoEm == "") {
                passAux.username = username;
                passAux.id = user._id;
                Modal.show('pass');
                return false;
            } else {
                Meteor.loginWithPassword({
                    username: username
                }, pass, function(err) {
                    if (err) {
                        alert = $(".alert-danger");
                        showHideAlert(alert);
                        var user = Meteor.users.findOne({
                            "username": username,
                        });
                        if (user) {
                            userFailure(user._id);
                        };
                    } else {
                        userSuccess(user._id);
                        Session.set('activeModal', 'a_inicio');
                    };
                });
            };
        };

        // } else {
        //     Meteor.loginWithLDAP(username, password, {
        //         dn: "uid=" + username + ",ou=people,o=caixa",
        //     }, function(error, success) {
        //         if (error) {
        //             console.log(error.reason);
        //         } else {
        //             console.log("OK");
        //         };
        //     });
        // };
    },
});

////////////////////////////////////////////////////////////////////////////////

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

var inicial = {
    ocorrencia: function() {
        var today = dateFormat(new Date(), "mm/yyyy");
        var ocorrencias = Ocorrencias.find().fetch();
        var count = 0;
        var fechamento;
        for (var i = 0; i < ocorrencias.length; i++) {
            fechamento = ocorrencias[i].fechamento;
            if (fechamento.substring(3, 10) == today) {
                count++;
            };
        };
        return count;
    },
    oficio: function() {
        var today = dateFormat(new Date(), "mm/yyyy");
        var oficios = Oficios.find().fetch();
        var count = 0;
        var abertura, aux, mesAno, vencimento, feixe, tipo, lim;
        for (var ii = 0; ii < oficios.length; ii++) {
            abertura = oficios[ii].abertura;
            aux = new Date(abertura.substring(6, 10) + "-" + abertura.substring(3, 5) + "-" + abertura.substring(0, 2) + "T00:00:00-0300");
            feixe = oficios[ii].feixe;
            tipo = oficios[ii].tipo;
            lim = p4_lim(feixe, tipo);
            if (lim) {
                vencimento = addDays(aux, Number(lim));
                if (dateFormat(vencimento, "mm/yyyy") == today) {
                    count++;
                };
            };
        };
        return count;
    },
    relatorio: function() {
        var today = dateFormat(new Date(), "mm/yyyy");
        var relatorios = Relatorios.find().fetch();
        var count = 0;
        var vencimento;
        for (var iii = 0; iii < relatorios.length; iii++) {
            vencimento = relatorios[iii].dataVencimento;
            if (vencimento.substring(3, 10) == today) {
                count++;
            };
        };
        return count;
    },
};

Template.a_inicio.helpers({
    inicial: inicial,
    isOfi: function() {
        if (Meteor.user().profile.perfil.perfil_nome != "OCORRENCIA" && Meteor.user().profile.perfil.perfil_nome != "AUDITORIA OCORRENCIA") {
            return true;
        } else {
            return false;
        };
    },
    isOco: function() {
        if (Meteor.user().profile.perfil.perfil_nome != "OFICIO" && Meteor.user().profile.perfil.perfil_nome != "AUDITORIA OFICIO") {
            return true;
        } else {
            return false;
        };
    },
});

var m_oco = {
    id: this._id,
    m_action_new: "m_oco_action_new",
    m_action_new_href: "m_oco_novo",
    m_action_view_href: "m_oco_view",
    m_action_edit_href: "m_oco_edit",
    m_action_back_href: "m_oco",
    m_action_clean: "m_oco_action_clean",
    m_action_find: "m_oco_action_find",
    m_action_export: "m_oco_action_export",
    m_action_back: "m_action_back",
    m_action_edit: "m_action_edit",
    m_action_save: "m_action_save",
    m_action_remove: "m_action_remove",
    m_ofi_form: "m_oco_form",
    m_edit_form: "m_edit_form",
    m_novo: "Criar nova ocorrência",
    m_edit: "Editar",
    m_save: "Gravar",
    m_voltar: "Voltar",
    m_remove: "Excluir",
    m_limpar: "Limpar campos da pesquisa",
    m_pesquisar: "Pesquisar ocorrências",
    m_exportar: "Exportar ocorrências em CSV",
    m_chamado: "",
    m_contrato: "",
    m_chave: "",
    m_tempo: "",
    m_operadora: "",
    m_unidade: "",
    m_status: "",
    m_abertura: "",
    m_finalizacao: "",
    m_descricao: "",
    m_status: "",
    m_responsabilidade: "",
    oco_pen: false,
    oco_novo: false,
};

var m_ocoOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Contrato',
        data: 'contrato', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Chave',
        data: 'chave', // note: access nested data like this
        className: '',
    }, {
        title: 'Chamado',
        data: 'chamado', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'fechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Horas',
        data: 'tempo', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Responsabilidade',
        data: 'responsabilidade', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_oco_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_oco_edit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 5
    }, {
        "width": "5%",
        "targets": 6
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 6
    }, {
        type: 'numeric-comma',
        "targets": 7
    }, {
        "width": "0.1%",
        "targets": 9
    }, {
        "width": "0.1%",
        "targets": 10
    }, {
        "width": "0em",
        "targets": 11
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var m_ocoAuditOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Contrato',
        data: 'contrato', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Chave',
        data: 'chave', // note: access nested data like this
        className: '',
    }, {
        title: 'Chamado',
        data: 'chamado', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'fechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Horas',
        data: 'tempo', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Responsabilidade',
        data: 'responsabilidade', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_oco_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 5
    }, {
        "width": "5%",
        "targets": 6
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 6
    }, {
        type: 'numeric-comma',
        "targets": 7
    }, {
        "width": "0.1%",
        "targets": 9
    }, {
        "width": "0em",
        "targets": 10
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var m_ocoData = function() {
    return Ocorrencias.find().fetch();
};

var m_oco_dt = function() {
    if (Meteor.user().profile.perfil.audit) {
        return m_ocoAuditOptions;
    } else {
        return m_ocoOptions;
    };
};

Template.m_oco.helpers({
    m_oco: m_oco,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ],
        };
    },
    reactiveDataFunction: function() {
        return m_ocoData;
    },
    m_ocoOptions: m_oco_dt,
    selectedOperadora: function(key) {
        return key == m_oco.m_operadora ? 'selected' : '';
    },
});

Template.m_oco.rendered = function() {
    if (m_oco.oco_pen) {
        $('#m_oco_action_find').click();
    } else {
        m_oco.m_unidade = "";
        m_oco.m_operadora = "";
        m_oco.m_chave = "";
        m_oco.m_abertura = "";
        m_oco.m_finalizacao = "";
    };
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#findDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findDataFinalizacao").inputmask("99/99/2099", {
        placeholder: " "
    });
    var autoComplete = document.getElementById('findCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#findDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findDataFechamento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findChave").inputmask("(99) 9999-9999", {
        placeholder: " "
    });
    $("#findContrato").inputmask("9999/9999", {
        placeholder: " "
    });
    $("#bread_2").html("Ocorrências");
    $("#bread_3").html("Manter Ocorrências");
}

Template.m_oco.destroyed = function() {
    m_oco.oco_pen = false;
};

Template.m_oco.events({
    'click #m_oco_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-warning").hide();
        $(".alert-success").hide();
        $("#findOperadora").val("");
        $("#findChave").val("");
        $("#findDataAbertura").val("");
        $("#findDataFinalizacao").val("");
        $("#findChamado").val("");
        $("#findContrato").val("");
        $("#findCGCUnidade").val("");
        $("#findStatus").val("");
        $("#findResponsabilidade").val("");
        $("#findDescricao").val("");
        m_oco.oco_pen = false;
        m_oco.oco_novo = false;
        m_oco.m_unidade = "";
        m_oco.m_operadora = "";
        m_oco.m_chave = "";
        m_oco.m_abertura = "";
        m_oco.m_finalizacao = "";
        return false;
    },
    'click #m_oco_action_find': function(event) {
        $(".alert-info").hide();
        $(".alert-warning").hide();
        $(".alert-success").hide();
        var operadora = $("#findOperadora").val();
        var chave = $("#findChave").val();
        var abertura = $("#findDataAbertura").val();
        var fechamento = $("#findDataFinalizacao").val();
        var chamado = $("#findChamado").val();
        var contrato = $("#findContrato").val();
        var status = $("#findStatus").val();
        var responsabilidade = $("#findResponsabilidade").val();
        var unidade = $("#findCGCUnidade").val();
        var descricao = $("#findDescricao").val();
        var ocorrencias = Ocorrencias.find().fetch();
        var abreFind, abreDiaFind, abreMesFind, abreAnoFind;
        var abreOco, abreDiaOco, abreMesOco, abreAnoOco;
        var fechaFind, fechaDiaFind, fechaMesFind, fechaAnoFind;
        var fechaOco, fechaDiaOco, fechaMesOco, fechaAnoOco;
        var descFind;
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < ocorrencias.length; i++) {
            var criteria = true;
            if (operadora != "") {
                if (ocorrencias[i].operadora.operadora_name == operadora) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (chave != "") {
                if (ocorrencias[i].chave == chave) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (abertura != "") {
                abreDiaFind = abertura.substring(0, 2);
                abreMesFind = abertura.substring(3, 5);
                abreAnoFind = abertura.substring(6, 10);
                abreFind = new Date(abreAnoFind + "-" + abreMesFind + "-" + abreDiaFind + "T00:00:00-0300");
                abreDiaOco = ocorrencias[i].abertura.substring(0, 2);
                abreMesOco = ocorrencias[i].abertura.substring(3, 5);
                abreAnoOco = ocorrencias[i].abertura.substring(6, 10);
                abreOco = new Date(abreAnoOco + "-" + abreMesOco + "-" + abreDiaOco + "T00:00:00-0300");
                if (abreOco >= abreFind) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (fechamento != "") {
                fechaDiaFind = fechamento.substring(0, 2);
                fechaMesFind = fechamento.substring(3, 5);
                fechaAnoFind = fechamento.substring(6, 10);
                fechaFind = new Date(fechaAnoFind + "-" + fechaMesFind + "-" + fechaDiaFind + "T00:00:00-0300");
                fechaDiaOco = ocorrencias[i].fechamento.substring(0, 2);
                fechaMesOco = ocorrencias[i].fechamento.substring(3, 5);
                fechaAnoOco = ocorrencias[i].fechamento.substring(6, 10);
                fechaOco = new Date(fechaAnoOco + "-" + fechaMesOco + "-" + fechaDiaOco + "T00:00:00-0300");
                if (fechaOco <= fechaFind) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (chamado != "") {
                if (ocorrencias[i].chamado == chamado) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (contrato != "") {
                if (ocorrencias[i].contrato == contrato) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (status != "") {
                if (ocorrencias[i].status == status) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (responsabilidade != "") {
                if (ocorrencias[i].responsabilidade == responsabilidade) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (unidade != "") {
                if (ocorrencias[i].unidade.unidade_name.includes(unidade.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (descricao != "") {
                descFind = ocorrencias[i].descricao.toUpperCase();
                if (descFind.includes(descricao.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    ocorrencias[i]
                );
            };
        };
        m_oco.oco_novo = false;
        return false;
    },
    'click #m_oco_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var operadora = $("#findOperadora").val();
        var chave = $("#findChave").val();
        var abertura = $("#findDataAbertura").val();
        var fechamento = $("#findDataFinalizacao").val();
        var chamado = $("#findChamado").val();
        var contrato = $("#findContrato").val();
        var status = $("#findStatus").val();
        var responsabilidade = $("#findResponsabilidade").val();
        var unidade = $("#findCGCUnidade").val();
        var descricao = $("#findDescricao").val();
        var descricaoAux = "";
        var abreFind, abreDiaFind, abreMesFind, abreAnoFind;
        var abreOco, abreDiaOco, abreMesOco, abreAnoOco;
        var fechaFind, fechaDiaFind, fechaMesFind, fechaAnoFind;
        var fechaOco, fechaDiaOco, fechaMesOco, fechaAnoOco;
        var descFind;
        var ocorrencias = Ocorrencias.find().fetch();
        var listAux = [];
        var obj = {};
        obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Contrato: "Contrato",
            Chave: "Chave",
            Chamado: "Chamado",
            Abertura: "Abertura",
            Fechamento: "Fechamento",
            Tempo: "Tempo (h)",
            Responsabilidade: "Responsabilidade",
            Descrição: "Descrição"
        };
        listAux.push(obj);
        var q = 0;
        for (var i = 0; i < ocorrencias.length; i++) {
            var criteria = true;
            if (unidade != "") {
                if (ocorrencias[i].unidade.unidade_name.includes(unidade.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (operadora != "") {
                if (ocorrencias[i].operadora.operadora_name == operadora) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (contrato != "") {
                if (ocorrencias[i].contrato == contrato) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (chamado != "") {
                if (ocorrencias[i].chamado == chamado) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (chave != "") {
                if (ocorrencias[i].chave == chave) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (abertura != "") {
                abreDiaFind = abertura.substring(0, 2);
                abreMesFind = abertura.substring(3, 5);
                abreAnoFind = abertura.substring(6, 10);
                abreFind = new Date(abreAnoFind + "-" + abreMesFind + "-" + abreDiaFind + "T00:00:00-0300");
                abreDiaOco = ocorrencias[i].abertura.substring(0, 2);
                abreMesOco = ocorrencias[i].abertura.substring(3, 5);
                abreAnoOco = ocorrencias[i].abertura.substring(6, 10);
                abreOco = new Date(abreAnoOco + "-" + abreMesOco + "-" + abreDiaOco + "T00:00:00-0300");
                if (abreOco >= abreFind) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (fechamento != "") {
                fechaDiaFind = fechamento.substring(0, 2);
                fechaMesFind = fechamento.substring(3, 5);
                fechaAnoFind = fechamento.substring(6, 10);
                fechaFind = new Date(fechaAnoFind + "-" + fechaMesFind + "-" + fechaDiaFind + "T00:00:00-0300");
                fechaDiaOco = ocorrencias[i].fechamento.substring(0, 2);
                fechaMesOco = ocorrencias[i].fechamento.substring(3, 5);
                fechaAnoOco = ocorrencias[i].fechamento.substring(6, 10);
                fechaOco = new Date(fechaAnoOco + "-" + fechaMesOco + "-" + fechaDiaOco + "T00:00:00-0300");
                if (fechaOco <= fechaFind) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (status != "") {
                if (ocorrencias[i].status == status) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (responsabilidade != "") {
                if (ocorrencias[i].responsabilidade == responsabilidade) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (descricao != "") {
                descFind = ocorrencias[i].descricao.toUpperCase();
                if (descFind.includes(descricao.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                if (ocorrencias[i].descricao == "" || ocorrencias[i].descricao == null || ocorrencias[i].descricao == undefined) {
                    descricaoAux = "";
                } else {
                    descricaoAux = ocorrencias[i].descricao;
                };
                obj = {
                    Operadora: ocorrencias[i].operadora.operadora_name,
                    Unidade: ocorrencias[i].unidade.unidade_name,
                    Contrato: ocorrencias[i].contrato,
                    Chave: ocorrencias[i].chave,
                    Chamado: ocorrencias[i].chamado,
                    Abertura: ocorrencias[i].abertura,
                    Fechamento: ocorrencias[i].fechamento,
                    Tempo: ocorrencias[i].tempo,
                    Responsabilidade: ocorrencias[i].responsabilidade,
                    Descrição: descricaoAux,
                };
                listAux.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(listAux, "Ocorrências");
            $("#reg").text(q);
            alert = $(".alert-success");
            showHideAlert(alert);

        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);

        };
        m_oco.oco_novo = false;
        return false;
    },

    'click .js-view': function(e, t) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Ocorrencias.findOne({
            _id: registroID
        });
        m_oco.id = registroID;
        m_oco.m_chamado = reg.chamado;
        m_oco.m_contrato = reg.contrato;
        m_oco.m_chave = reg.chave;
        m_oco.m_tempo = reg.tempo;
        m_oco.m_operadora = reg.operadora.operadora_name;
        m_oco.m_status = reg.status;
        m_oco.m_abertura = reg.abertura;
        m_oco.m_fechamento = reg.fechamento;
        m_oco.m_unidade = reg.unidade.unidade_name;
        m_oco.m_descricao = reg.descricao;
        m_oco.m_status = reg.status;
        m_oco.m_responsabilidade = reg.responsabilidade;
        m_oco.oco_novo = false;
        Session.set('activeModal', href);
    },
    'click .js-edit': function(e, t) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Ocorrencias.findOne({
            _id: registroID
        });
        m_oco.id = registroID;
        m_oco.m_chamado = reg.chamado;
        m_oco.m_contrato = reg.contrato;
        m_oco.m_chave = reg.chave;
        m_oco.m_tempo = reg.tempo;
        m_oco.m_operadora = reg.operadora.operadora_name;
        m_oco.m_status = reg.status;
        m_oco.m_abertura = reg.abertura;
        m_oco.m_fechamento = reg.fechamento;
        m_oco.m_unidade = reg.unidade.unidade_name;
        m_oco.m_descricao = reg.descricao;
        m_oco.m_status = reg.status;
        m_oco.m_responsabilidade = reg.responsabilidade;
        m_oco.oco_novo = false;
        Session.set('activeModal', href);
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.m_oco_view.helpers({
    m_oco: m_oco,
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.m_oco_view.events({
    'click #m_action_back': function(event) {
        var href = $(event.target).attr("data-page");
        m_oco.oco_pen = false;
        m_oco.m_operadora = "";
        m_oco.m_unidade = "";
        m_oco.m_chave = "";
        m_oco.m_abertura = "";
        m_oco.m_finalizacao = "";
        m_oco.oco_novo = false;
        Session.set('activeModal', href);
    },
    'click #m_action_edit': function(event) {
        m_oco.oco_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },

});

Template.m_oco_view.destroyed = function() {
    m_oco.oco_pen = false;
};

////////////////////////////////////////////////////////////////////////////////

Template.m_oco_edit.helpers({
    m_oco: m_oco,
    selectedResponsabilidade: function(key) {
        return key == m_oco.m_responsabilidade ? 'selected' : '';
    },
});

Template.m_oco_edit.rendered = function() {
    var resp = $('#inputResponsabilidade').val();
    if (resp != "OPERADORA") {
        $("#desc").html("Descrição <span class='required'>*</span>");
    };
    $('#inputResponsabilidade').on('change', function() {
        var resp = $('#inputResponsabilidade').val();
        if (resp != "OPERADORA") {
            $("#desc").html("Descrição <span class='required'>*</span>");

        } else {
            $("#desc").html("Descrição");
        };
    });
    $("#bread_2").html("Ocorrências");
    $("#bread_3").html("Manter Ocorrências");

};

Template.m_oco_edit.destroyed = function() {
    m_oco.oco_pen = false;
    m_oco.m_operadora = "";
    m_oco.m_unidade = "";
    m_oco.m_chave = "";
    m_oco.m_abertura = "";
    m_oco.m_finalizacao = "";
};

Template.m_oco_edit.events({
    'click #m_action_back': function(event) {
        var ocorrencia = Ocorrencias.findOne({
            _id: m_oco.id,
        });
        var resp = $("#inputResponsabilidade").val();
        var desc = $("#inputDescricao").val();
        if (m_oco.oco_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (ocorrencia.responsabilidade == resp && ocorrencia.descricao == desc) {
            var href = $(event.target).attr("data-page");
            m_oco.oco_pen = false;
            m_oco.m_operadora = "";
            m_oco.m_unidade = "";
            m_oco.m_chave = "";
            m_oco.m_abertura = "";
            m_oco.m_finalizacao = "";
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backEditOco";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro da ocorrência. Tem certeza que deseja sair sem atualizar a ocorrência?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = m_oco.id;
            Modal.show('popUp');
        };
    },
    'click #m_action_save': function(event) {
        $(".alert-danger").hide();
        $(".alert-success").hide();
        m_oco.oco_pen = false;
        m_oco.m_operadora = "";
        m_oco.m_unidade = "";
        m_oco.m_chave = "";
        m_oco.m_abertura = "";
        m_oco.m_finalizacao = "";
        var responsabilidade = $("#inputResponsabilidade").val();
        var descricao = $("#inputDescricao").val();
        var id = m_oco.id;
        if (responsabilidade != "OPERADORA" && descricao == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
            m_oco.oco_novo = false;
        } else {
            modals.modalType = "editOco";
            modals.modalTitle = "Confirmação de Alteração";
            modals.modalMessage = "Tem certeza que deseja atualizar a ocorrência?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, atualizar";
            modals.modalId = id;
            Modal.show('popUp');
        };
        return false;
    },
});


////////////////////////////////////////////////////////////////////////////////
var m_ofi = {
    id: this._id,
    m_action_new: "m_ofi_action_new",
    m_action_new_href: "m_ofi_novo",
    m_action_view_href: "m_ofi_view",
    m_action_edit_href: "m_ofi_edit",
    m_action_back_href: "m_ofi",
    m_action_clean: "m_ofi_action_clean",
    m_action_find: "m_ofi_action_find",
    m_action_export: "m_ofi_action_export",
    m_action_back: "m_action_back",
    m_action_edit: "m_action_edit",
    m_action_save: "m_action_save",
    m_action_remove: "m_action_remove",
    m_ofi_form: "m_ofi_form",
    m_edit_form: "m_edit_form",
    m_novo: "Criar novo ofício",
    m_edit: "Editar",
    m_save: "Gravar",
    m_voltar: "Voltar",
    m_remove: "Excluir",
    m_limpar: "Limpar campos da pesquisa",
    m_pesquisar: "Pesquisar ofícios",
    m_exportar: "Exportar ofícios em CSV",
    m_codigo: "",
    m_oficio: "",
    m_feixe: "",
    m_tipo: "",
    m_operadora: "",
    m_unidade: "",
    m_status: "",
    m_abertura: "",
    m_finalizacao: "",
    ofi_novo: false,
};

var m_ofiOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Feixe',
        data: 'feixe', // note: access nested data like this
        className: '',
    }, {
        title: 'Tipo',
        data: 'tipo', // note: access nested data like this
        className: '',
    }, {
        title: 'Código',
        data: 'codigo', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Ofício',
        data: 'oficio', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Status',
        data: 'status', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Finalização',
        data: 'finalizacao', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_ofi_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_ofi_edit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 7
    }, {
        "width": "5%",
        "targets": 8
    }, {
        type: 'date-euro',
        "targets": 7
    }, {
        type: 'date-euro',
        "targets": 8
    }, {
        "width": "0.1%",
        "targets": 9
    }, {
        "width": "0.1%",
        "targets": 10
    }, {
        "width": "0.1%",
        "targets": 11
    }, {
        "width": "0em",
        "targets": 12
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var m_ofiAuditOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Feixe',
        data: 'feixe', // note: access nested data like this
        className: '',
    }, {
        title: 'Tipo',
        data: 'tipo', // note: access nested data like this
        className: '',
    }, {
        title: 'Código',
        data: 'codigo', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Ofício',
        data: 'oficio', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Status',
        data: 'status', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Finalização',
        data: 'finalizacao', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_ofi_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 7
    }, {
        "width": "5%",
        "targets": 8
    }, {
        type: 'date-euro',
        "targets": 7
    }, {
        type: 'date-euro',
        "targets": 8
    }, {
        "width": "0.1%",
        "targets": 9
    }, {
        "width": "0em",
        "targets": 10
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var m_ofi_dt = function() {
    if (Meteor.user().profile.perfil.audit) {
        return m_ofiAuditOptions;
    } else {
        return m_ofiOptions;
    };
};

var m_ofiData = function() {
    var oficios = Oficios.find().fetch();
    var ofiStatus = "";
    var ofiID = "";
    var final = "";
    for (var i = 0; i < oficios.length; i++) {
        ofiID = oficios[i]._id;
        if (oficios[i].finalizacao != "" && oficios[i].finalizacao != null) {
            ofiStatus = "FINALIZADO";
        } else {
            ofiStatus = "SOLICITADO";
        };
        Oficios.update(ofiID, {
            $set: {
                status: ofiStatus,
            },
        });
    };
    return Oficios.find().fetch();
};

Template.m_ofi.helpers({
    m_ofi: m_ofi,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ],
        };
    },
    reactiveDataFunction: function() {
        return m_ofiData;
    },
    m_ofiOptions: m_ofi_dt,
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.m_ofi.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#findDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findDataFinalizacao").inputmask("99/99/2099", {
        placeholder: " "
    });
    var autoComplete = document.getElementById('findCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#findDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findDataFechamento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findCodigo").inputmask("999999", {
        placeholder: " "
    });
    $("#findOficio").inputmask("9999/9999", {
        placeholder: " "
    });
    $("#bread_2").html("Ofícios");
    $("#bread_3").html("Manter Ofícios");
}

Template.m_ofi.events({
    'click #m_ofi_action_new': function(event) {
        m_ofi.ofi_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_ofi_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        $("#findDataAbertura").val("");
        $("#findCGCUnidade").val("");
        $("#findFeixe").val("");
        $("#findDataFinalizacao").val("");
        $("#findOficio").val("");
        $("#findStatus").val("");
        $("#findOperadora").val("");
        $("#findCodigo").val("");
        $("#findTipo").val("");
        m_ofi.ofi_novo = false;
        return false;
    },
    'click .js-view': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Oficios.findOne({
            _id: registroID
        });
        m_ofi.id = registroID;
        m_ofi.m_codigo = reg.codigo;
        m_ofi.m_oficio = reg.oficio;
        m_ofi.m_feixe = reg.feixe;
        m_ofi.m_tipo = reg.tipo;
        m_ofi.m_operadora = reg.operadora.operadora_name;
        m_ofi.m_status = reg.status;
        m_ofi.m_abertura = reg.abertura;
        m_ofi.m_finalizacao = reg.finalizacao;
        m_ofi.m_unidade = reg.unidade.unidade_name;;
        m_ofi.ofi_novo = false;
        Session.set('activeModal', href);
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Oficios.findOne({
            _id: registroID
        });
        m_ofi.id = registroID;
        m_ofi.m_codigo = reg.codigo;
        m_ofi.m_oficio = reg.oficio;
        m_ofi.m_feixe = reg.feixe;
        m_ofi.m_tipo = reg.tipo;
        m_ofi.m_operadora = reg.operadora.operadora_name;
        m_ofi.m_status = reg.status;
        m_ofi.m_abertura = reg.abertura;
        m_ofi.m_finalizacao = reg.finalizacao;
        m_ofi.m_unidade = reg.unidade.unidade_name;
        m_ofi.ofi_novo = false;
        Session.set('activeModal', href);
    },
    'click .js-remove': function(e, t) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var id = $(e.target).parent().parent().find('td:last').text();
        modals.modalType = "delOfi";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover o ofício?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        Modal.show('popUp');
        m_ofi.ofi_novo = false;
        return false;
    },
    'click #m_ofi_action_find': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var abertura = $("#findDataAbertura").val();
        var unidade = $("#findCGCUnidade").val();
        var feixe = $("#findFeixe").val();
        var finalizacao = $("#findDataFinalizacao").val();
        var oficio = $("#findOficio").val();
        var status = $("#findStatus").val();
        var operadora = $("#findOperadora").val();
        var codigo = $("#findCodigo").val();
        var tipo = $("#findTipo").val();
        var list = Oficios.find().fetch();
        var abreFind, abreDiaFind, abreMesFind, abreAnoFind;
        var abreOco, abreDiaOco, abreMesOco, abreAnoOco;
        var fechaFind, fechaDiaFind, fechaMesFind, fechaAnoFind;
        var fechaOco, fechaDiaOco, fechaMesOco, fechaAnoOco;
        $("table[id*='DataTables']").dataTable().fnClearTable();
        if (abertura == "" && unidade == "" && feixe == "" && finalizacao == "" && oficio == "" && status == "" && operadora == "" && codigo == "" && tipo == "") {
            for (var i = 0; i < list.length; i++) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    list[i]
                );
            };
        } else {
            for (var i = 0; i < list.length; i++) {
                var criteria = true;
                if (abertura != "") {
                    abreDiaFind = abertura.substring(0, 2);
                    abreMesFind = abertura.substring(3, 5);
                    abreAnoFind = abertura.substring(6, 10);
                    abreFind = new Date(abreAnoFind + "-" + abreMesFind + "-" + abreDiaFind + "T00:00:00-0300");
                    abreDiaOco = list[i].abertura.substring(0, 2);
                    abreMesOco = list[i].abertura.substring(3, 5);
                    abreAnoOco = list[i].abertura.substring(6, 10);
                    abreOco = new Date(abreAnoOco + "-" + abreMesOco + "-" + abreDiaOco + "T00:00:00-0300");
                    if (abreOco >= abreFind) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (finalizacao != "") {
                    fechaDiaFind = finalizacao.substring(0, 2);
                    fechaMesFind = finalizacao.substring(3, 5);
                    fechaAnoFind = finalizacao.substring(6, 10);
                    fechaFind = new Date(fechaAnoFind + "-" + fechaMesFind + "-" + fechaDiaFind + "T00:00:00-0300");
                    fechaDiaOco = list[i].finalizacao.substring(0, 2);
                    fechaMesOco = list[i].finalizacao.substring(3, 5);
                    fechaAnoOco = list[i].finalizacao.substring(6, 10);
                    fechaOco = new Date(fechaAnoOco + "-" + fechaMesOco + "-" + fechaDiaOco + "T00:00:00-0300");
                    if (fechaOco <= fechaFind) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (unidade != "") {
                    if (list[i].unidade.unidade_name.includes(unidade.toUpperCase())) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (feixe != "") {
                    if (list[i].feixe == feixe) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (oficio != "") {
                    if (list[i].oficio.includes(oficio)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (status != "") {
                    if (list[i].status == status) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (operadora != "") {
                    if (list[i].operadora.operadora_name == operadora) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (codigo != "") {
                    if (list[i].codigo == codigo) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (tipo != "") {
                    if (list[i].tipo == tipo) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (criteria) {
                    $("table[id*='DataTables']").dataTable().fnAddData(
                        list[i]
                    );
                };
            };
        };
        m_ofi.ofi_novo = false;
        return false;
    },
    'click #m_ofi_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var abertura = $("#findDataAbertura").val();
        var unidade = $("#findCGCUnidade").val();
        var feixe = $("#findFeixe").val();
        var finalizacao = $("#findDataFinalizacao").val();
        var oficio = $("#findOficio").val();
        var status = $("#findStatus").val();
        var operadora = $("#findOperadora").val();
        var codigo = $("#findCodigo").val();
        var tipo = $("#findTipo").val();
        var abreFind, abreDiaFind, abreMesFind, abreAnoFind;
        var abreOco, abreDiaOco, abreMesOco, abreAnoOco;
        var fechaFind, fechaDiaFind, fechaMesFind, fechaAnoFind;
        var fechaOco, fechaDiaOco, fechaMesOco, fechaAnoOco;
        var list = Oficios.find().fetch();
        var listAux = [];
        var obj = {};
        obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Feixe: "Feixe",
            Tipo: "Tipo",
            Codigo: "Código",
            Oficio: "Ofício",
            Status: "Status",
            Abertura: "Abertura",
            Finalizacao: "Finalização"
        };
        listAux.push(obj);
        var q = 0;
        if (abertura == "" && unidade == "" && feixe == "" && finalizacao == "" && oficio == "" && status == "" && operadora == "" && codigo == "" && tipo == "") {
            for (var i = 0; i < list.length; i++) {
                if (list[i].finalizacao == "" || list[i].finalizacao == null || list[i].finalizacao == "undefined") {
                    fecha = "";
                } else {
                    fecha = list[i].finalizacao;
                };
                obj = {
                    Operadora: list[i].operadora.operadora_name,
                    Unidade: list[i].unidade.unidade_name,
                    Feixe: list[i].feixe,
                    Tipo: list[i].tipo,
                    Codigo: list[i].codigo,
                    Oficio: list[i].oficio,
                    Status: list[i].status,
                    Abertura: list[i].abertura,
                    Finalizacao: fecha,
                };
                listAux.push(obj);
                q++;
            };
        } else {
            for (var i = 0; i < list.length; i++) {
                var criteria = true;
                if (abertura != "") {
                    abreDiaFind = abertura.substring(0, 2);
                    abreMesFind = abertura.substring(3, 5);
                    abreAnoFind = abertura.substring(6, 10);
                    abreFind = new Date(abreAnoFind + "-" + abreMesFind + "-" + abreDiaFind + "T00:00:00-0300");
                    abreDiaOco = list[i].abertura.substring(0, 2);
                    abreMesOco = list[i].abertura.substring(3, 5);
                    abreAnoOco = list[i].abertura.substring(6, 10);
                    abreOco = new Date(abreAnoOco + "-" + abreMesOco + "-" + abreDiaOco + "T00:00:00-0300");
                    if (abreOco >= abreFind) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (finalizacao != "") {
                    fechaDiaFind = finalizacao.substring(0, 2);
                    fechaMesFind = finalizacao.substring(3, 5);
                    fechaAnoFind = finalizacao.substring(6, 10);
                    fechaFind = new Date(fechaAnoFind + "-" + fechaMesFind + "-" + fechaDiaFind + "T00:00:00-0300");
                    fechaDiaOco = list[i].finalizacao.substring(0, 2);
                    fechaMesOco = list[i].finalizacao.substring(3, 5);
                    fechaAnoOco = list[i].finalizacao.substring(6, 10);
                    fechaOco = new Date(fechaAnoOco + "-" + fechaMesOco + "-" + fechaDiaOco + "T00:00:00-0300");
                    if (fechaOco <= fechaFind) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (unidade != "") {
                    if (list[i].unidade.unidade_name.includes(unidade.toUpperCase())) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (feixe != "") {
                    if (list[i].feixe == feixe) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (oficio != "") {
                    if (list[i].oficio.includes(oficio)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (status != "") {
                    if (list[i].status == status) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (operadora != "") {
                    if (list[i].operadora.operadora_name == operadora) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (codigo != "") {
                    if (list[i].codigo == codigo) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (tipo != "") {
                    if (list[i].tipo == tipo) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (criteria) {
                    if (list[i].finalizacao == "" || list[i].finalizacao == null || list[i].finalizacao == "undefined") {
                        fecha = "";
                    } else {
                        fecha = list[i].finalizacao;
                    };
                    obj = {
                        Operadora: list[i].operadora.operadora_name,
                        Unidade: list[i].unidade.unidade_name,
                        Feixe: list[i].feixe,
                        Tipo: list[i].tipo,
                        Codigo: list[i].codigo,
                        Oficio: list[i].oficio,
                        Status: list[i].status,
                        Abertura: list[i].abertura,
                        Finalizacao: fecha,
                    };
                    listAux.push(obj);
                    q++;
                };
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(listAux, "Ofícios");
            $("#reg").text(q);
            alert = $(".alert-success");
            showHideAlert(alert);
        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
        m_ofi.ofi_novo = false;
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.m_ofi_view.helpers({
    m_ofi: m_ofi,
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.m_ofi_view.events({
    'click #m_ofi_action_new': function(event) {
        m_ofi.ofi_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_action_back': function(event) {
        m_ofi.ofi_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_action_edit': function(event) {
        m_ofi.ofi_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.m_ofi_edit.helpers({
    m_ofi: m_ofi,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ]
        };
    },
    selectedStatus: function(key) {
        return key == m_ofi.m_status ? 'selected' : '';
    },
    selectedFeixe: function(key) {
        return key == m_ofi.m_feixe ? 'selected' : '';
    },
    selectedOperadora: function(key) {
        return key == m_ofi.m_operadora ? 'selected' : '';
    },
    selectedTipo: function(key) {
        return key == m_ofi.m_tipo ? 'selected' : '';
    },
});

Template.m_ofi_edit.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('inputUnidade');
    autoComplete.autocomplete = 'off';
    $("#inputDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputDataFinalizacao").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputCodigo").inputmask("999999", {
        placeholder: " "
    });
    $("#inputOficio").inputmask("9999/9999", {
        placeholder: " "
    });
    $('#inputDataFinalizacao').on("change paste keyup", function() {
        var dia = $('#inputDataFinalizacao').val();
        var diaJS = new Date(dia.substring(6, 10) + "-" + dia.substring(3, 5) + "-" + dia.substring(0, 2));
        if (dia != "" && diaJS instanceof Date && isFinite(diaJS)) {
            $("#inputStatus").val("FINALIZADO");
        } else {
            $("#inputStatus").val("SOLICITADO");
        };
    });
    $("#bread_2").html("Ofícios");
    $("#bread_3").html("Manter Ofícios");
};

Template.m_ofi_edit.events({
    'click #m_ofi_action_new': function(event) {
        m_ofi.ofi_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_action_back': function(event) {
        var oficio = Oficios.findOne({
            _id: m_ofi.id,
        });
        var abre = $("#inputDataAbertura").val();
        var final = $("#inputDataFinalizacao").val();
        var codigo = $("#inputCodigo").val();
        var oficioAux = $("#inputOficio").val();
        var operadora = $("#inputOperadora").val();
        var feixe = $("#inputFeixe").val();
        var tipo = $("#inputTipo").val();
        var unidade = $("#inputUnidade").val();
        if (m_ofi.ofi_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        }
        if (oficio.abertura == abre && oficio.finalizacao == final && oficio.codigo == codigo && oficio.oficio == oficioAux && oficio.operadora.operadora_name == operadora && oficio.feixe == feixe && oficio.tipo == tipo && oficio.unidade.unidade_name == unidade) {
            var href = $(event.target).attr("data-page");
            m_ofi.m_codigo = "";
            m_ofi.m_oficio = "";
            m_ofi.m_feixe = "";
            m_ofi.m_tipo = "";
            m_ofi.m_status = "";
            m_ofi.m_operadora = "";
            m_ofi.m_abertura = "";
            m_ofi.m_finalizacao = "";
            m_ofi.m_unidade = "";
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backEditOfi";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro do ofício. Tem certeza que deseja sair sem atualizar o ofício?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = m_oco.id;
            Modal.show('popUp');
        };
    },
    'click #m_action_save': function(event) {
        $(".alert-danger").hide();
        $(".alert-info").hide();
        $(".alert-sucess").hide();
        var today = dataJS_BR(new Date());
        var abertura = $("#inputDataAbertura").val();
        var finalizacao = $("#inputDataFinalizacao").val();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var oficio = $("#inputOficio").val();
        var status = $("#inputStatus").val();
        var operadora = $("#inputOperadora").val();
        var codigo = $("#inputCodigo").val();
        var tipo = $("#inputTipo").val();
        var id = m_ofi.id;
        var ofiStatus = "";
        if (abertura == "" || unidade == "" || feixe == "" || oficio == "" || operadora == "" || codigo == "" || tipo == "" || status == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
            m_ofi.ofi_novo = false;
        } else if (!validaDataOfi(abertura, finalizacao)) {
            alert = $(".alert-info");
            showHideAlert(alert);
            m_ofi.ofi_novo = false;
        } else {
            if (finalizacao != "" && finalizacao != null) {
                ofiStatus = "FINALIZADO";
            } else {
                relStatus = "SOLICITADO";
            };
            modals.modalType = "editOfi";
            modals.modalTitle = "Confirmação de Alteração";
            modals.modalMessage = "Tem certeza que deseja atualizar o ofício?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, atualizar";
            modals.modalId = id;
            Modal.show('popUp');
        };
        return false;
    },
    'click #m_action_remove': function(event) {
        var id = m_ofi.id;
        modals.modalType = "editDelOfi";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover o ofício?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        Modal.show('popUp');
        m_ofi.ofi_novo = false;
        return false;
    },

});

////////////////////////////////////////////////////////////////////////////////

var m_ofi_novo = {
    m_novo_action_save: "m_ofi_novo_action_save",
    m_novo_action_clean: "m_ofi_novo_action_clean",
    m_novo_action_back: "m_ofi_novo_action_back",
    m_novo_action_back_href: "m_ofi",
    m_novo_form: "m_ofi_novo_form",
    m_novo_gravar: "Gravar novo ofício",
    m_novo_limpar: "Limpar campos do novo ofício",
    m_novo_voltar: "Voltar para tela de consulta de ofícios",
    ofi_novo: false,
    unidades: Unidades.find(),
};

Template.m_ofi_novo.helpers({
    m_ofi_novo: m_ofi_novo,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ]
        };
    }
});

Template.m_ofi_novo.events({
    'click #m_ofi_novo_action_back': function(event) {
        var abre = $("#inputDataAbertura").val();
        var codigo = $("#inputCodigo").val();
        var oficio = $("#inputOficio").val();
        var operadora = $("#inputOperadora").val();
        var feixe = $("#inputFeixe").val();
        var tipo = $("#inputTipo").val();
        var unidade = $("#inputUnidade").val();
        if (m_ofi_novo.ofi_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (abre == "" && codigo == "" && oficio == "" && operadora == "" && feixe == "" && tipo == "" && unidade == "") {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backNewOfi";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro do ofício. Tem certeza que deseja sair sem salvar o ofício?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = m_ofi.id;
            Modal.show('popUp');
        };
    },
    'click #m_ofi_novo_action_clean': function(event) {
        $("#inputDataAbertura").val("");
        $("#inputCGCUnidade").val("");
        $("#inputFeixe").val("");
        $("#inputDataFinalizacao").val("");
        $("#inputOficio").val("");
        $("#inputOperadora").val("");
        $("#inputCodigo").val("");
        $("#inputTipo").val("");
        $(".alert-danger").hide();
        $(".alert-info").hide();
        $(".alert-sucess").hide();
        m_ofi_novo.ofi_novo = false;
    },
    'click #m_ofi_novo_action_save': function(event) {
        $(".alert-danger").hide();
        $(".alert-info").hide();
        $(".alert-warning").hide();
        $(".alert-sucess").hide();
        var abertura = $("#inputDataAbertura").val();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var oficio = $("#inputOficio").val();
        var status = $("#inputStatus").val();
        var operadora = $("#inputOperadora").val();
        var codigo = $("#inputCodigo").val();
        var tipo = $("#inputTipo").val();
        if (abertura == "" || unidade == "" || feixe == "" || oficio == "" || operadora == "" || codigo == "" || tipo == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
            m_ofi_novo.ofi_novo = false;
        } else if (!validaUnicoOfi(codigo, oficio)) {
            alert = $(".alert-info");
            showHideAlert(alert);
            m_ofi_novo.ofi_novo = false;
        } else {
            modals.modalType = "newOfi";
            modals.modalTitle = "Confirmação de Cadastramento";
            modals.modalMessage = "Deseja realmente inserir o ofício?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, gravar";
            Modal.show('popUp');
        };
        return false;
    },
});

Template.m_ofi_novo.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            locale: "pt-br",
            // format: 'L',
            format: 'DD/MM/YYYY',
        });
    });
    var autoComplete = document.getElementById('inputUnidade');
    autoComplete.autocomplete = 'off';
    $("#inputDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputCodigo").inputmask("999999", {
        placeholder: " "
    });
    $("#inputOficio").inputmask("9999/9999", {
        placeholder: " "
    });
    $("#bread_2").html("Ofícios");
    $("#bread_3").html("Manter Ofícios");
}

////////////////////////////////////////////////////////////////////////////////

var m_rel = {
    id: this._id,
    m_action_new: "m_rel_action_new",
    m_action_new_href: "m_rel_novo",
    m_action_view_href: "m_rel_view",
    m_action_edit_href: "m_rel_edit",
    m_action_back_href: "m_rel",
    m_action_clean: "m_rel_action_clean",
    m_action_find: "m_rel_action_find",
    m_action_export: "m_rel_action_export",
    m_action_back: "m_action_back",
    m_action_edit: "m_action_edit",
    m_action_save: "m_action_save",
    m_action_remove: "m_action_remove",
    m_rel_form: "m_rel_form",
    m_edit_form: "m_edit_form",
    m_novo: "Criar novo relatório",
    m_edit: "Editar",
    m_save: "Gravar",
    m_voltar: "Voltar",
    m_remove: "Excluir",
    m_limpar: "Limpar campos da pesquisa",
    m_pesquisar: "Pesquisar relatórios",
    m_exportar: "Exportar relatórios em CSV",
    m_dataAbertura: "",
    m_dataVencimento: "",
    m_dataFechamento: "",
    m_cgcUnidade: "",
    m_titulo: "",
    m_descricao: "",
    m_operadora: "",
    m_status: "",
    rel_novo: false,
};

var m_relOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'cgcUnidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Status',
        data: 'status', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'dataAbertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Vencimento',
        data: 'dataVencimento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'dataFechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Título',
        data: 'titulo', // note: access nested data like this
        className: '',
    }, {
        title: 'Descrição',
        data: 'descricao', // note: access nested data like this
        className: '',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_rel_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_rel_edit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 3
    }, {
        "width": "5%",
        "targets": 4
    }, {
        "width": "5%",
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 3
    }, {
        type: 'date-euro',
        "targets": 4
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        "width": "20%",
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
    }, {
        "width": "0em",
        "targets": 11
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var m_relAuditOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'cgcUnidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Status',
        data: 'status', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'dataAbertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Vencimento',
        data: 'dataVencimento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'dataFechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Título',
        data: 'titulo', // note: access nested data like this
        className: '',
    }, {
        title: 'Descrição',
        data: 'descricao', // note: access nested data like this
        className: '',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='m_rel_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 3
    }, {
        "width": "5%",
        "targets": 4
    }, {
        "width": "5%",
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 3
    }, {
        type: 'date-euro',
        "targets": 4
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        "width": "20%",
        "targets": 7
    }, {
        "width": "0.1%",
        "targets": 8
    }, {
        "width": "0em",
        "targets": 9
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var m_relData = function() {
    var relatorios = Relatorios.find().fetch();
    var relStatus = "";
    var relID = "";
    var date = new Date();
    var vence = "";
    for (var i = 0; i < relatorios.length; i++) {
        relID = relatorios[i]._id;
        vence = dataMongo(relatorios[i].dataVencimento);
        if (relatorios[i].dataFechamento != "" && relatorios[i].dataFechamento != null) {
            relStatus = "FINALIZADO";
        } else if (date > vence) {
            relStatus = "ATRASADO";
        } else {
            relStatus = "EM ANDAMENTO";
        };
        Relatorios.update(relID, {
            $set: {
                status: relStatus,
            },
        });
    };
    return Relatorios.find().fetch(); // or .map()
};

var m_rel_dt = function() {
    if (Meteor.user().profile.perfil.audit) {
        return m_relAuditOptions;
    } else {
        return m_relOptions;
    };
};
Template.m_rel.helpers({
    m_rel: m_rel,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ],
        };
    },
    reactiveDataFunction: function() {
        return m_relData;
    },
    m_relOptions: m_rel_dt,
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.m_rel.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#findDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findDataFechamento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#findDataVencimento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#bread_2").html("Relatórios");
    $("#bread_3").html("Manter Relatórios");
};

Template.m_rel.events({
    'click #m_rel_action_new': function(event) {
        m_rel.rel_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_rel_action_clean': function(event) {
        $('.alert-success').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        $("#findDataAbertura").val("");
        $("#findDataVencimento").val("");
        $("#findDataFechamento").val("");
        $("#findCGCUnidade").val("");
        $("#findTitulo").val("");
        $("#findDescricao").val("");
        $("#findStatus").val("");
        $("#findOperadora").val("");
        m_rel.rel_novo = false;
        return false;
    },
    'click .js-view': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Relatorios.findOne({
            _id: registroID
        });
        m_rel.id = registroID;
        m_rel.m_dataAbertura = reg.dataAbertura;
        m_rel.m_dataVencimento = reg.dataVencimento;
        m_rel.m_dataFechamento = reg.dataFechamento;
        m_rel.m_cgcUnidade = reg.cgcUnidade.unidade_name;
        m_rel.m_titulo = reg.titulo;
        m_rel.m_descricao = reg.descricao;
        m_rel.m_status = reg.status;
        m_rel.m_operadora = reg.operadora.operadora_name;
        m_rel.rel_novo = false;
        Session.set('activeModal', href);
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Relatorios.findOne({
            _id: registroID
        });
        m_rel.id = registroID;
        m_rel.m_dataAbertura = reg.dataAbertura;
        m_rel.m_dataVencimento = reg.dataVencimento;
        m_rel.m_dataFechamento = reg.dataFechamento;
        m_rel.m_cgcUnidade = reg.cgcUnidade.unidade_name;
        m_rel.m_titulo = reg.titulo;
        m_rel.m_descricao = reg.descricao;
        m_rel.m_status = reg.status;
        m_rel.m_operadora = reg.operadora.operadora_name;
        m_rel.rel_novo = false;
        Session.set('activeModal', href);
    },
    'click .js-remove': function(e, t) {
        $('.alert-success').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        var id = $(e.target).parent().parent().find('td:last').text();
        modals.modalType = "delRel";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover o relatório?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        m_rel.rel_novo = false;
        Modal.show('popUp');
        return false;
    },
    'click #m_rel_action_find': function(event) {
        $('.alert-success').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        var dataAbertura = $("#findDataAbertura").val();
        var dataVencimento = $("#findDataVencimento").val();
        var dataFechamento = $("#findDataFechamento").val();
        var cgcUnidade = $("#findCGCUnidade").val();
        var titulo = $("#findTitulo").val();
        var descricao = $("#findDescricao").val();
        var status = $("#findStatus").val();
        var operadora = $("#findOperadora").val();
        var list = Relatorios.find().fetch();
        if (dataAbertura == "" && dataVencimento == "" && dataFechamento == "" && cgcUnidade == "" && titulo == "" && descricao == "" && status == "" && operadora == "") {
            $("table[id*='DataTables']").dataTable().fnClearTable();
            for (var i = 0; i < list.length; i++) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    list[i]
                );
            };
        } else {
            $("table[id*='DataTables']").dataTable().fnClearTable();
            for (var i = 0; i < list.length; i++) {
                var criteria = true;
                if (dataAbertura != "") {
                    var aberturaList = dataMongo(list[i].dataAbertura);
                    var aberturaForm = dataMongo(dataAbertura);
                    if (aberturaList >= aberturaForm) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (dataVencimento != "") {
                    var vencimentoList = dataMongo(list[i].dataVencimento);
                    var vencimentoForm = dataMongo(dataVencimento);
                    if (vencimentoList <= vencimentoForm) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (dataFechamento != "") {
                    if (list[i].dataFechamento == dataFechamento) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (status != "") {
                    if (list[i].status == status) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (operadora != "") {
                    if (list[i].operadora.operadora_name == operadora) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (cgcUnidade != "") {
                    if (list[i].cgcUnidade.unidade_name.includes(cgcUnidade)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (titulo != "") {
                    var tituloStr = list[i].titulo;
                    if (list[i].titulo.includes(titulo)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (descricao != "") {
                    if (list[i].descricao.includes(descricao)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (criteria) {
                    $("table[id*='DataTables']").dataTable().fnAddData(
                        list[i]
                    );
                };
            };
        };
        m_rel.rel_novo = false;
        return false;
    },
    'click #m_rel_action_export': function(event) {
        $('.alert-success').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        var dataAbertura = $("#findDataAbertura").val();
        var dataVencimento = $("#findDataVencimento").val();
        var dataFechamento = $("#findDataFechamento").val();
        var cgcUnidade = $("#findCGCUnidade").val();
        var titulo = $("#findTitulo").val();
        var descricao = $("#findDescricao").val();
        var status = $("#findStatus").val();
        var operadora = $("#findOperadora").val();
        var list = Relatorios.find().fetch();
        var listAux = [];
        var obj = {};
        obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Status: "Status",
            Abertura: "Abertura",
            Vencimento: "Vencimento",
            Fechamento: "Fechamento",
            Titulo: "Título",
            Descricao: "Descrição",
        }
        listAux.push(obj);
        var fecha = "";
        var q = 0;
        if (dataAbertura == "" && dataVencimento == "" && dataFechamento == "" && cgcUnidade == "" && titulo == "" && descricao == "" && status == "" && operadora == "") {
            for (var j = 0; j < list.length; j++) {
                if (list[j].dataFechamento == "" || list[j].dataFechamento == null || list[j].dataFechamento == "undefined") {
                    fecha = "";
                } else {
                    fecha = list[j].dataFechamento;
                };
                obj = {
                    Operadora: list[j].operadora.operadora_name,
                    Unidade: list[j].cgcUnidade.unidade_name,
                    Status: list[j].status,
                    Abertura: list[j].dataAbertura,
                    Vencimento: list[j].dataVencimento,
                    Fechamento: fecha,
                    Titulo: list[j].titulo,
                    Descricao: list[j].descricao,
                };
                listAux.push(obj);
                q++;
            };
        } else {
            for (var i = 0; i < list.length; i++) {
                var criteria = true;
                if (dataAbertura != "") {
                    var aberturaList = dataMongo(list[i].dataAbertura);
                    var aberturaForm = dataMongo(dataAbertura);
                    if (aberturaList >= aberturaForm) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (dataVencimento != "") {
                    var vencimentoList = dataMongo(list[i].dataVencimento);
                    var vencimentoForm = dataMongo(dataVencimento);
                    if (vencimentoList <= vencimentoForm) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (dataFechamento != "") {
                    if (list[i].dataFechamento == dataFechamento) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (status != "") {
                    if (list[i].status == status) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (operadora != "") {
                    if (list[i].operadora.operadora_name == operadora) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (cgcUnidade != "") {
                    if (list[i].cgcUnidade.unidade_name.includes(cgcUnidade)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (titulo != "") {
                    var tituloStr = list[i].titulo;
                    if (list[i].titulo.includes(titulo)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (descricao != "") {
                    if (list[i].descricao.includes(descricao)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (criteria) {
                    if (list[i].dataFechamento == "" || list[i].dataFechamento == null || list[i].dataFechamento == "undefined") {
                        fecha = "";
                    } else {
                        fecha = list[i].dataFechamento;
                    };
                    obj = {
                        Operadora: list[i].operadora.operadora_name,
                        Unidade: list[i].cgcUnidade.unidade_name,
                        Status: list[i].status,
                        Abertura: list[i].dataAbertura,
                        Vencimento: list[i].dataVencimento,
                        Fechamento: fecha,
                        Titulo: list[i].titulo,
                        Descricao: list[i].descricao,
                    };
                    listAux.push(obj);
                    q++;
                };
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(listAux, "Relatórios");
            $("#reg").text(q);
            alert = $(".alert-success");
            showHideAlert(alert);
        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
        m_rel.rel_novo = false;
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.m_rel_view.helpers({
    m_rel: m_rel,
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.m_rel_view.events({
    'click #m_rel_action_new': function(event) {
        m_rel.rel_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_action_back': function(event) {
        m_rel.rel_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_action_edit': function(event) {
        m_rel.rel_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.m_rel_edit.helpers({
    m_rel: m_rel,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ]
        };
    },
    selectedStatus: function(key) {
        return key == m_rel.m_status ? 'selected' : '';
    },
    selectedOperadora: function(key) {
        return key == m_rel.m_operadora ? 'selected' : '';
    },
});

Template.m_rel_edit.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('inputCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#inputDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputDataFechamento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputDataVencimento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $('#inputDataVencimento').on("change paste keyup", function() {
        var dia = $('#inputDataVencimento').val();
        var diaJS = new Date(dia.substring(6, 10) + "-" + dia.substring(3, 5) + "-" + dia.substring(0, 2));
        if (dia != "" && diaJS instanceof Date && isFinite(diaJS) && new Date >= diaJS) {
            $("#inputStatus").val("ATRASADO");
        } else {
            $("#inputStatus").val("EM ANDAMENTO");
        };
    });
    $('#inputDataFechamento').on("change paste keyup", function() {
        var dia = $('#inputDataFechamento').val();
        var diaVence = $('#inputDataVencimento').val();
        var diaJS = new Date(dia.substring(6, 10) + "-" + dia.substring(3, 5) + "-" + dia.substring(0, 2));
        var diaVence = new Date(diaVence.substring(6, 10) + "-" + diaVence.substring(3, 5) + "-" + diaVence.substring(0, 2));
        if (dia != "" && diaJS instanceof Date && isFinite(diaJS)) {
            $("#inputStatus").val("FINALIZADO");
        } else if (new Date >= diaVence) {
            $("#inputStatus").val("ATRASADO");
        } else {
            $("#inputStatus").val("EM ANDAMENTO");
        };
    });
    $("#bread_2").html("Relatórios");
    $("#bread_3").html("Manter Relatórios");
};

Template.m_rel_edit.events({
    'click #m_rel_action_new': function(event) {
        m_rel.rel_novo = false;
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
    },
    'click #m_action_back': function(event) {
        var rel = Relatorios.findOne({
            _id: m_rel.id
        });
        var operadora = $("#inputOperadora").val();
        var abre = $("#inputDataAbertura").val();
        var vence = $("#inputDataVencimento").val();
        var fecha = $("#inputDataFechamento").val();
        var titulo = $("#inputTitulo").val();
        var status = $("#inputStatus").val();
        var unidade = $("#inputCGCUnidade").val();
        var desc = $("#inputDescricao").val();
        if (m_rel.rel_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (rel.operadora.operadora_name == operadora && rel.dataAbertura == abre && rel.dataVencimento == vence && rel.dataFechamento == fecha && rel.titulo == titulo && rel.status == status && rel.cgcUnidade.unidade_name == unidade && rel.descricao == desc) {
            m_rel.id = "";
            m_rel.m_dataAbertura = "";
            m_rel.m_dataVencimento = "";
            m_rel.m_dataFechamento = "";
            m_rel.m_cgcUnidade = "";
            m_rel.m_titulo = "";
            m_rel.m_descricao = "";
            m_rel.m_status = "";
            m_rel.m_operadora = "";
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backEditRel";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro do relatório. Tem certeza que deseja sair sem atualizar o relatório?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = m_rel.id;
            Modal.show('popUp');
        };
    },
    'click #m_action_save': function(event) {
        $('.alert-danger').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        var relStatus = "";
        var dataAbertura = $("#inputDataAbertura").val();
        var dataVencimento = $("#inputDataVencimento").val();
        var dataFechamento = $("#inputDataFechamento").val();
        var cgcUnidade = $("#inputCGCUnidade").val();
        var titulo = $("#inputTitulo").val();
        var descricao = $("#inputDescricao").val();
        var operadora = $("#inputOperadora").val();
        if (dataAbertura == "" || dataVencimento == "" || cgcUnidade == "" || titulo == "" || descricao == "" || operadora == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
            m_rel.rel_novo = false;
        } else if (!validaDataRel(dataAbertura, dataVencimento, dataFechamento)) {
            alert = $(".alert-info");
            showHideAlert(alert);
            m_rel.rel_novo = false;
        } else {
            modals.modalType = "editRel";
            modals.modalTitle = "Confirmação de Alteração";
            modals.modalMessage = "Tem certeza que deseja atualizar o relatório?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, atualizar";
            modals.modalId = m_rel.id;
            Modal.show('popUp');
        };
        return false;
    },
    'click #m_action_remove': function(event) {
        var id = m_rel.id;
        modals.modalType = "delRel2";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover o relatório?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        Modal.show('popUp');
        m_rel.rel_novo = false;
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

var m_rel_novo = {
    m_novo_action_save: "m_rel_novo_action_save",
    m_novo_action_clean: "m_rel_novo_action_clean",
    m_novo_action_back: "m_rel_novo_action_back",
    m_novo_action_back_href: "m_rel",
    m_novo_form: "m_rel_novo_form",
    m_novo_gravar: "Gravar novo relatório",
    m_novo_limpar: "Limpar campos do novo relatório",
    m_novo_voltar: "Voltar para tela de consulta de relatórios",
    rel_novo: false,
};

Template.m_rel_novo.helpers({
    m_rel_novo: m_rel_novo,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: true,
            }, ]
        };
    }
});

Template.m_rel_novo.events({
    'click #m_rel_novo_action_back': function(event) {
        var operadora = $("#inputOperadora").val();
        var abre = $("#inputDataAbertura").val();
        var vence = $("#inputDataVencimento").val();
        var titulo = $("#inputTitulo").val();
        var unidade = $("#inputCGCUnidade").val();
        var desc = $("#inputDescricao").val();
        if (m_rel_novo.rel_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (operadora == "" && abre == "" && vence == "" && titulo == "" && unidade == "" && desc == "") {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backNewRel";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro do relatório. Tem certeza que deseja sair sem salvar o relatório?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = m_rel.id;
            Modal.show('popUp');
        };
        m_rel_novo.rel_novo = false;
    },
    'click #m_rel_novo_action_clean': function(event) {
        $('.alert-danger').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        $("#inputDataAbertura").val("");
        $("#inputDataVencimento").val("");
        $("#inputCGCUnidade").val("");
        $("#inputTitulo").val("");
        $("#inputDescricao").val("");
        $("#inputOperadora").val("");
        m_rel_novo.rel_novo = false;
    },
    'click #m_rel_novo_action_save': function(event) {
        $('.alert-danger').hide();
        $('.alert-info').hide();
        $('.alert-warning').hide();
        var today = dataJS_BR(new Date());
        var relStatus = "";
        var dataAbertura = $("#inputDataAbertura").val();
        var dataVencimento = $("#inputDataVencimento").val();
        var cgcUnidade = $("#inputCGCUnidade").val();
        var titulo = $("#inputTitulo").val();
        var descricao = $("#inputDescricao").val();
        var operadora = $("#inputOperadora").val();
        if (dataAbertura == "" || dataVencimento == "" || cgcUnidade == "" || titulo == "" || descricao == "" || operadora == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
            m_rel_novo.rel_novo = false;
        } else if (!validaDataRel(dataAbertura, dataVencimento, "")) {
            alert = $(".alert-info");
            showHideAlert(alert);
            m_rel_novo.rel_novo = false;
        } else {
            modals.modalType = "newRel";
            modals.modalTitle = "Confirmação de Cadastramento";
            modals.modalMessage = "Deseja realmente inserir o relatório?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, gravar";
            Modal.show('popUp');
        };
        return false;
    },
});

Template.m_rel_novo.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('inputCGCUnidade');
    autoComplete.autocomplete = 'off';
    $("#inputDataAbertura").inputmask("99/99/2099", {
        placeholder: " "
    });
    $("#inputDataVencimento").inputmask("99/99/2099", {
        placeholder: " "
    });
    $('#inputDataVencimento').on("change paste keyup", function() {
        var dia = $('#inputDataVencimento').val();
        var diaJS = new Date(dia.substring(6, 10) + "-" + dia.substring(3, 5) + "-" + dia.substring(0, 2));
        if (dia != "" && diaJS instanceof Date && isFinite(diaJS) && new Date > diaJS) {
            $("#inputStatus").val("ATRASADO");
        } else {
            $("#inputStatus").val("EM ANDAMENTO");
        };
    });
    $("#bread_2").html("Relatórios");
    $("#bread_3").html("Manter Relatórios");
};

////////////////////////////////////////////////////////////////////////////////

var c_p = {
    c_p_action_export: "c_p_action_export",
    c_p_action_clean: "c_p_action_clean",
    c_p_action_elaborate: "c_p_action_elaborate",
    c_p_form: "c_p_form",
    c_p_exportar: "Exportar penalidade",
    c_p_limpar: "Limpar campos da penalidade",
    c_p_elaborar: "Elaborar penalidade",
    unidades: Unidades.find(),
};

////////////////////////////////////////////////////////////////////////////////

var c_p1Options = {
    columns: [{
        title: 'Operadora',
        data: 'ocorrencia.operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'ocorrencia.unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Contrato',
        data: 'ocorrencia.contrato', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Chave',
        data: 'ocorrencia.chave', // note: access nested data like this
        className: '',
    }, {
        title: 'Chamado',
        data: 'ocorrencia.chamado', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'fechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Horas',
        data: 'ttich', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'DMA(%)',
        data: 'dma', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fatura',
        data: 'fatura.valor', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'P1',
        data: 'p1', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='p1_edit' class='glyphicon glyphicon-usd js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "15%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 5
    }, {
        "width": "5%",
        "targets": 6
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 6
    }, {
        type: 'numeric-comma',
        "targets": 8
    }, {
        "width": "0.1%",
        "targets": 11
    }, {
        "width": "0em",
        "targets": 12
    }],
    searching: false,
    autoWidth: true,
    bInfo: true,

    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
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
                valorMongo(i) :
                // replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                i : 0;
        };

        // Total over all pages
        total = api
            .column(10)
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Total over this page
        pageTotal = api
            .column(10, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Update footer
        total = numeral(total).format('$0,0.00')
        pageTotal = numeral(pageTotal).format('$0,0.00')
        $(".dataTables_wrapper > .footer").html(
            pageTotal + ' (' + total + ' Total)'
        );
    },

    // ... see jquery.dataTables docs for more

};

function dma(mesAno, ttich) {
    var mes = Number(mesAno.substring(0, 2));
    // console.log("mes: " +mes);
    var ano = Number(mesAno.substring(3, 7));
    // console.log("ano: " +ano);
    var ttmm = getDiasMA(mes, ano) * 60 * 24;
    // console.log("ttmm: " +ttmm);
    var tticm = (ttich) * 60;
    // console.log("tticm: " +tticm);
    return ((ttmm - tticm) / ttmm);
};

function p1(operadora, mesAno, ttich, fatura) {
    var param = Parametros.findOne();
    var indice = dma(mesAno, ttich);
    if (operadora == "OI") {
        if (valorMongo(param.p1F1_O) > (indice * 100)) {
            return (valorMongo(param.p1F2_O) + (1 - indice)) * valorMongo(fatura);
        };
    } else {
        if (valorMongo(param.p1F1_EA) > (indice * 100)) {
            return valorMongo(param.p1F2_EA) * valorMongo(fatura);
        };
    };
    return false;
};

function P1() {
    var penalidade, penalidades;
    var ocorrencias = Ocorrencias.find().fetch();
    var ocorrencia, p1Antigo;
    var abertura, dia, mes, ano, mesAno, hora;
    var fechamento, diaF, mesF, anoF, mesAnoF, horaF;
    var operadora, unidade, chave, ttich, indice;
    var mesAux, aberturaAux, fechamentoAux;
    var faturas;
    var fatura;
    var valor;
    var diffDias;
    var dataAux;
    for (var i = 0; i < ocorrencias.length; i++) {
        ocorrencia = ocorrencias[i];
        p1Antigo = PenalidadesP1.findOne({
            "ocorrencia._id": ocorrencia._id,
        });
        if (!p1Antigo && ocorrencia.responsabilidade == "OPERADORA") {
            abertura = ocorrencia.abertura;
            dia = abertura.substring(0, 2);
            mes = abertura.substring(3, 5);
            ano = abertura.substring(6, 10);
            mesAno = monthYearBR(mes + "/" + ano);
            fechamento = ocorrencia.fechamento;
            diaF = fechamento.substring(0, 2);
            mesF = fechamento.substring(3, 5);
            anoF = fechamento.substring(6, 10);
            horaF = fechamento.substring(11, 19);
            mesAnoF = monthYearBR(mesF + "/" + anoF);
            operadora = ocorrencia.operadora.operadora_name;
            unidade = ocorrencia.unidade.unidade_name;
            chave = ocorrencia.chave;
            ttich = valorMongo(ocorrencia.tempo);
            if (mesAno == mesAnoF) {
                if (p1(operadora, mesAno, ttich, "R$1,00")) {
                    indice = (dma(mesAno, ttich)) * 100;
                    PenalidadesP1.insert({
                        ocorrencia: ocorrencia,
                        abertura: abertura,
                        fechamento: fechamento,
                        ttich: numeral(ttich).format('0,0.00'),
                        dma: numeral(indice).format('0.0[0000]'),
                        fatura: "",
                        p1: "",
                        criadoEm: dataEHora(),
                        criadoPor: Meteor.user(),
                        modificadoEm: dataEHora(),
                        modificadoPor: Meteor.user(),
                    });
                };
            } else {
                if (mesF > mes) {
                    for (var ii = Number(mes); ii <= Number(mesF); ii++) {
                        mesAux = ii;
                        if (mesAux == Number(mes)) {
                            hora = abertura.substring(11, 19);
                            aberturaAux = new Date(ano + "-" + mes + "-" + dia + "T" + hora + "-0300");
                            fechamentoAux = new Date(ano + "-" + mes + "-" + getDiasMA(mes, ano) + "T23:59:59-0300");
                        } else if (mesAux == Number(mesF)) {
                            horaF = fechamento.substring(11, 19);
                            aberturaAux = new Date(anoF + "-" + mesF + "-" + "01" + "T" + "00:00:00" + "-0300");
                            fechamentoAux = new Date(anoF + "-" + mesF + "-" + diaF + "T" + horaF + "-0300");
                        } else {
                            aberturaAux = new Date(ano + "-" + mesAux + "-" + "01" + "T" + "00:00:00" + "-0300");
                            fechamentoAux = new Date(ano + "-" + mesAux + "-" + getDiasMA(mesAux, ano) + "T23:59:59-0300");
                        };
                        diffDias = ((fechamentoAux - aberturaAux) / 86400000);
                        ttich = (diffDias * 24).toFixed(2);
                        indice = (dma(mesAno, ttich)) * 100;
                        PenalidadesP1.insert({
                            ocorrencia: ocorrencia,
                            abertura: dateFormat(aberturaAux, "dd/mm/yyyy HH:MM:ss"),
                            fechamento: dateFormat(fechamentoAux, "dd/mm/yyyy HH:MM:ss"),
                            ttich: numeral(ttich).format('0,0.00'),
                            dma: numeral(indice).format('0.0[0000]'),
                            fatura: "",
                            p1: "",
                            criadoEm: dataEHora(),
                            criadoPor: Meteor.user(),
                            modificadoEm: dataEHora(),
                            modificadoPor: Meteor.user(),
                        });
                    };
                } else {
                    for (var iii = Number(mes); iii <= 12; iii++) {
                        mesAux = iii;
                        if (mesAux == Number(mes)) {
                            hora = abertura.substring(11, 19);
                            aberturaAux = new Date(ano + "-" + mes + "-" + dia + "T" + hora + "-0300");
                            fechamentoAux = new Date(ano + "-" + mes + "-" + getDiasMA(mes, ano) + "T23:59:59-0300");
                        } else {
                            aberturaAux = new Date(ano + "-" + mesAux + "-" + "01" + "T" + "00:00:00" + "-0300");
                            fechamentoAux = new Date(ano + "-" + mesAux + "-" + getDiasMA(mesAux, ano) + "T23:59:59-0300");
                        };
                        diffDias = ((fechamentoAux - aberturaAux) / 86400000);
                        ttich = (diffDias * 24).toFixed(2);
                        PenalidadesP1.insert({
                            ocorrencia: ocorrencia,
                            abertura: dateFormat(aberturaAux, "dd/mm/yyyy HH:MM:ss"),
                            fechamento: dateFormat(fechamentoAux, "dd/mm/yyyy HH:MM:ss"),
                            ttich: numeral(ttich).format('0,0.00'),
                            dma: numeral(indice).format('0.0[0000]'),
                            fatura: "",
                            p1: "",
                            criadoEm: dataEHora(),
                            criadoPor: Meteor.user(),
                            modificadoEm: dataEHora(),
                            modificadoPor: Meteor.user(),
                        });
                    };
                    for (var iiii = 1; iiii <= Number(mesF); iiii++) {
                        mesAux = iiii;
                        if (mesAux == Number(mesF)) {
                            horaF = fechamento.substring(11, 19);
                            aberturaAux = new Date(anoF + "-" + mesF + "-" + "01" + "T" + "00:00:00" + "-0300");
                            fechamentoAux = new Date(anoF + "-" + mesF + "-" + diaF + "T" + horaF + "-0300");
                        } else {
                            aberturaAux = new Date(ano + "-" + mesAux + "-" + "01" + "T" + "00:00:00" + "-0300");
                            fechamentoAux = new Date(ano + "-" + mesAux + "-" + getDiasMA(mesAux, ano) + "T23:59:59-0300");
                        };
                        diffDias = ((fechamentoAux - aberturaAux) / 86400000);
                        ttich = (diffDias * 24).toFixed(2);
                        indice = (dma(mesAno, ttich)) * 100;
                        PenalidadesP1.insert({
                            ocorrencia: ocorrencia,
                            abertura: dateFormat(aberturaAux, "dd/mm/yyyy HH:MM:ss"),
                            fechamento: dateFormat(fechamentoAux, "dd/mm/yyyy HH:MM:ss"),
                            ttich: numeral(ttich).format('0,0.00'),
                            dma: numeral(indice).format('0.0[0000]'),
                            fatura: "",
                            p1: "",
                            criadoEm: dataEHora(),
                            criadoPor: Meteor.user(),
                            modificadoEm: dataEHora(),
                            modificadoPor: Meteor.user(),
                        });
                    };
                };
            };
        };
    };
    penalidades = PenalidadesP1.find().fetch();
    for (var v = 0; v < penalidades.length; v++) {
        penalidade = penalidades[v];
        mesF = penalidade.fechamento.substring(3, 5);
        anoF = penalidade.fechamento.substring(6, 10);
        mesAnoF = monthYearBR(mesF + "/" + anoF);
        fatura = Faturas.findOne({
            "operadora.operadora_name": penalidade.ocorrencia.operadora.operadora_name,
            "mesAno": mesAnoF,
            "unidade.unidade_name": penalidade.ocorrencia.unidade.unidade_name,
            "feixe": penalidade.ocorrencia.chave,
        });
        if (fatura) {
            valor = fatura.valor;
            penalty = p1(penalidade.ocorrencia.operadora.operadora_name, mesAnoF, valorMongo(penalidade.ttich), valor);
            PenalidadesP1.update(penalidade._id, {
                $set: {
                    // fatura: numeral(valor).format('$0,0.00'),
                    fatura: fatura,
                    p1: numeral(penalty).format('$0,0.00'),
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
        } else {
            PenalidadesP1.update(penalidade._id, {
                $set: {
                    fatura: {
                        _id: "",
                        valor: ""
                    },
                    p1: "",
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
        };
    };
};

var c_p1Data = function() {
    return PenalidadesP1.find().fetch();
};

Template.c_p1.helpers({
    c_p: c_p,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    reactiveDataFunction: function() {
        return c_p1Data;
    },
    c_p1Options: c_p1Options,
});

Template.c_p1.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#bread_2").html("Penalidades");
    $("#bread_3").html("P1");
};

Template.c_p1.events({
    'click #c_p_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();;
        $("#findUnidade").val("");
        $("#findOperadora").val("");
        $("#findMesAno").val("");
        return false;
    },
    'click #c_p_action_elaborate': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var penalidadesP1 = PenalidadesP1.find().fetch();
        var ocorrencia;
        var operadora = $("#findOperadora").val();
        var unidade = $("#findUnidade").val();
        var abertura;
        var mesAno = $("#findMesAno").val();
        var mes = mesAno.substring(0, 2);
        var ano = mesAno.substring(3, 7);
        var penalty;
        var fechamentoList, anoList, mesList;
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < penalidadesP1.length; i++) {
            penalty = penalidadesP1[i];
            ocorrencia = penalty.ocorrencia;
            if (unidade != "") {
                if (unidade != ocorrencia.unidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != ocorrencia.operadora.operadora_name) {
                    continue;
                };
            };
            if (mesAno != "") {
                fechamentoList = ocorrencia.fechamento;
                mesList = fechamentoList.substring(3, 5);
                anoList = fechamentoList.substring(6, 10);
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            $("table[id*='DataTables']").dataTable().fnAddData(
                penalty
            );
        };
        return false;
    },
    'click #c_p_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var penalidadesP1 = PenalidadesP1.find().fetch();
        var ocorrencia;
        var operadora = $("#findOperadora").val();
        var unidade = $("#findUnidade").val();
        var abertura;
        var mesAno = $("#findMesAno").val();
        var mes = mesAno.substring(0, 2);
        var ano = mesAno.substring(3, 7);
        var penalty;
        var fechamentoList, anoList, mesList, pTotal;
        var list = [];
        var obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Contrato: "Contrato",
            Chave: "Chave",
            Chamado: "Chamado",
            Abertura: "Abertura",
            Fechamento: "Fechamento",
            Tempo: "Tempo (h)",
            DMA: "DMA (%)",
            Fatura: "Fatura",
            P1: "P1",
        };
        list.push(obj);
        var pRel = 0;
        for (var i = 0; i < penalidadesP1.length; i++) {
            penalty = penalidadesP1[i];
            ocorrencia = penalty.ocorrencia;
            if (unidade != "") {
                if (unidade != ocorrencia.unidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != ocorrencia.operadora.operadora_name) {
                    continue;
                };
            };
            if (mes != "") {
                fechamentoList = ocorrencia.fechamento;
                mesList = fechamentoList.substring(3, 5);
                anoList = fechamentoList.substring(6, 10);
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            obj = {
                Operadora: ocorrencia.operadora.operadora_name,
                Unidade: ocorrencia.unidade.unidade_name,
                Contrato: ocorrencia.contrato,
                Chave: ocorrencia.chave,
                Chamado: ocorrencia.chamado,
                Abertura: penalty.abertura,
                Fechamento: penalty.fechamento,
                Tempo: penalty.ttich,
                DMA: penalty.dma,
                Fatura: penalty.fatura,
                P1: penalty.p1,
            };
            pTotal = penalty.p1,
                pTotal = pTotal.replace("R$", "").replace(",", ";").replace(".", "").replace(";", ".");
            pRel += Number(pTotal);
            list.push(obj);
        };
        obj = {
            Operadora: "",
            Unidade: "",
            Contrato: "",
            Chave: "",
            Chamado: "",
            Abertura: "",
            Fechamento: "",
            Tempo: "",
            DMA: "",
            Fatura: "TOTAL",
            P1: numeral(pRel).format('$0,0.00'),
        };
        list.push(obj);
        if (list.length == 2) {
            alert = $(".alert-warning");
            showHideAlert(alert);
        } else {
            JSONToCSVConvertor(list, "Penalidade_P1");
            $("#reg").text((list.length) - 2);
            alert = $(".alert-success");
            showHideAlert(alert);
        };
        return false;
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = "a_fat";
        var reg = PenalidadesP1.findOne({
            _id: registroID
        });
        // console.log("registroID: " + registroID);
        // console.log("reg: " + reg);
        var unidade = reg.ocorrencia.unidade.unidade_name;
        var operadora = reg.ocorrencia.operadora.operadora_name;
        var chave = reg.ocorrencia.chave;
        Session.set('activeModal', href);
        a_fat.fat_unidade = unidade;
        a_fat.fat_operadora = operadora;
        a_fat.fat_feixe = chave;
        a_fat.fat_pen = true;
    },
});

////////////////////////////////////////////////////////////////////////////////

var c_p2Options = {
    columns: [{
        title: 'Operadora',
        data: 'ocorrencia.operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'ocorrencia.unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Contrato',
        data: 'ocorrencia.contrato', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Chave',
        data: 'ocorrencia.chave', // note: access nested data like this
        className: '',
    }, {
        title: 'Chamado',
        data: 'ocorrencia.chamado', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'ocorrencia.abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'ocorrencia.fechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Horas',
        data: 'ocorrencia.tempo', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fatura',
        data: 'fatura.valor', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'P2',
        data: 'p2', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='p2_edit' class='glyphicon glyphicon-usd js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 5
    }, {
        "width": "5%",
        "targets": 6
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 6
    }, {
        type: 'numeric-comma',
        "targets": 7
    }, {
        "width": "0.1%",
        "targets": 10
    }, {
        "width": "0em",
        "targets": 11
    }],
    searching: false,
    autoWidth: true,
    bInfo: true,

    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros", //"Nenhum registro encontrado",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
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
                valorMongo(i) :
                // replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                i : 0;
        };

        // Total over all pages
        total = api
            .column(9)
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Total over this page
        pageTotal = api
            .column(9, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Update footer
        total = numeral(total).format('$0,0.00')
        pageTotal = numeral(pageTotal).format('$0,0.00')
        $(".dataTables_wrapper > .footer").html(
            pageTotal + ' (' + total + ' Total)'
        );
    },

    // ... see jquery.dataTables docs for more
};

function p2(operadora, tempo, fatura) {
    var param = Parametros.findOne();
    var limite, fator;
    if (operadora == "OI") {
        limite = param.p2F1_O;
        fator = param.p2F2_O;
    } else {
        limite = param.p2F1_EA;
        fator = param.p2F2_EA;
    };
    if (valorMongo(tempo) > valorMongo(limite)) {
        if (operadora == "OI") {
            return (valorMongo(fator) / 100) * valorMongo(fatura);
        } else {
            return (valorMongo(fator) / 100) * valorMongo(fatura) * valorMongo(tempo);
        }
    };
    return false;
};

function P2() {
    var penalidade, penalidades;
    var ocorrencias = Ocorrencias.find().fetch();
    var ocorrencia, penalty, penaltyAntigo;
    for (var i = 0; i < ocorrencias.length; i++) {
        ocorrencia = ocorrencias[i];
        penalty = p2(ocorrencia.operadora.operadora_name, ocorrencia.tempo, "R$1,00");
        if (penalty) {
            penaltyAntigo = PenalidadesP2.findOne({
                "ocorrencia._id": ocorrencia._id,
            });
            if (!penaltyAntigo && ocorrencia.responsabilidade == "OPERADORA") {
                PenalidadesP2.insert({
                    ocorrencia: ocorrencia,
                    fatura: "",
                    p2: "",
                    criadoEm: dataEHora(),
                    criadoPor: Meteor.user(),
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                });
            };
        };
    };
    var penalidades = PenalidadesP2.find().fetch();
    var penalidade, fatura, mes, ano, mesAno, operadora, unidade, id, penalty, chave;
    for (var j = 0; j < penalidades.length; j++) {
        penalidade = penalidades[j];
        id = penalidade._id;
        mes = penalidade.ocorrencia.abertura.substring(3, 5);
        ano = penalidade.ocorrencia.abertura.substring(6, 10);
        mesAno = monthYearBR(mes + "/" + ano);
        operadora = penalidade.ocorrencia.operadora.operadora_name;
        unidade = penalidade.ocorrencia.unidade.unidade_name;
        chave = penalidade.ocorrencia.chave;
        fatura = Faturas.findOne({
            "feixe": chave,
            "mesAno": mesAno,
            "operadora.operadora_name": operadora,
            "unidade.unidade_name": unidade,
        });
        if (fatura) {
            penalty = p2(penalidade.ocorrencia.operadora.operadora_name, penalidade.ocorrencia.tempo, fatura.valor);
            PenalidadesP2.update(id, {
                $set: {
                    fatura: fatura,
                    p2: numeral(penalty).format('$0,0.00'),
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
        } else {
            PenalidadesP2.update(id, {
                $set: {
                    fatura: {
                        _id: "",
                        valor: ""
                    },
                    p2: "",
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
        };
    };
};

var c_p2Data = function() {
    return PenalidadesP2.find().fetch();
};

Template.c_p2.helpers({
    c_p: c_p,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    reactiveDataFunction: function() {
        return c_p2Data;
    },
    c_p2Options: c_p2Options,
});

Template.c_p2.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#bread_2").html("Penalidades");
    $("#bread_3").html("P2");
};

Template.c_p2.events({
    'click #c_p_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        $("#findUnidade").val("");
        $("#findOperadora").val("");
        $("#findMesAno").val("");
        return false;
    },
    'click #c_p_action_elaborate': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var penalidades = PenalidadesP2.find().fetch();
        var ocorrencia;
        var operadora = $("#findOperadora").val();
        var unidade = $("#findUnidade").val();
        var abertura;
        var mesAno = $("#findMesAno").val();
        var mes = mesAno.substring(0, 2);
        var ano = mesAno.substring(3, 7);
        var penalty;
        var fechamentoList, anoList, mesList;
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < penalidades.length; i++) {
            penalty = penalidades[i];
            ocorrencia = penalty.ocorrencia;
            if (unidade != "") {
                if (unidade != ocorrencia.unidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != ocorrencia.operadora.operadora_name) {
                    continue;
                };
            };
            if (mesAno != "") {
                fechamentoList = ocorrencia.fechamento;
                mesList = fechamentoList.substring(3, 5);
                anoList = fechamentoList.substring(6, 10);
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            $("table[id*='DataTables']").dataTable().fnAddData(
                penalty
            );
        };
        return false;
    },
    'click #c_p_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var penalidades = PenalidadesP2.find().fetch();
        var ocorrencia;
        var operadora = $("#findOperadora").val();
        var unidade = $("#findUnidade").val();
        var abertura;
        var mesAno = $("#findMesAno").val();
        var mes = mesAno.substring(0, 2);
        var ano = mesAno.substring(3, 7);
        var penalty;
        var fechamentoList, anoList, mesList, pTotal;
        var list = [];
        var obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Contrato: "Contrato",
            Chave: "Chave",
            Chamado: "Chamado",
            Abertura: "Abertura",
            Fechamento: "Fechamento",
            Tempo: "Tempo (h)",
            Fatura: "Fatura",
            P2: "P2",
        };
        list.push(obj);
        var pRel = 0;
        for (var i = 0; i < penalidades.length; i++) {
            penalty = penalidades[i];
            ocorrencia = penalty.ocorrencia;
            if (unidade != "") {
                if (unidade != ocorrencia.unidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != ocorrencia.operadora.operadora_name) {
                    continue;
                };
            };
            if (mes != "") {
                fechamentoList = ocorrencia.abertura;
                mesList = fechamentoList.substring(3, 5);
                anoList = fechamentoList.substring(6, 10);
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            obj = {
                Operadora: ocorrencia.operadora.operadora_name,
                Unidade: ocorrencia.unidade.unidade_name,
                Contrato: ocorrencia.contrato,
                Chave: ocorrencia.chave,
                Chamado: ocorrencia.chamado,
                Abertura: ocorrencia.abertura,
                Fechamento: ocorrencia.fechamento,
                Tempo: ocorrencia.tempo,
                Fatura: penalty.fatura,
                P2: penalty.p2,
            };
            pTotal = penalty.p2,
                pTotal = pTotal.replace("R$", "").replace(",", ";").replace(".", "").replace(";", ".");
            pRel += Number(pTotal);
            list.push(obj);
        };
        obj = {
            Operadora: "",
            Unidade: "",
            Contrato: "",
            Chave: "",
            Chamado: "",
            Abertura: "",
            Fechamento: "",
            Tempo: "",
            Fatura: "TOTAL",
            P2: numeral(pRel).format('$0,0.00'),
        };
        list.push(obj);
        if (list.length == 2) {
            alert = $(".alert-warning");
            showHideAlert(alert);
        } else {
            JSONToCSVConvertor(list, "Penalidade_P2");
            $("#reg").text((list.length) - 2);
            alert = $(".alert-success");
            showHideAlert(alert);
        };
        return false;
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = "a_fat";
        var reg = PenalidadesP2.findOne({
            _id: registroID
        });
        // console.log("registroID: " + registroID);
        // console.log("reg: " + reg);
        var unidade = reg.ocorrencia.unidade.unidade_name;
        var operadora = reg.ocorrencia.operadora.operadora_name;
        var chave = reg.ocorrencia.chave;
        Session.set('activeModal', href);
        a_fat.fat_unidade = unidade;
        a_fat.fat_operadora = operadora;
        a_fat.fat_feixe = chave;
        a_fat.fat_pen = true;
    },
});


////////////////////////////////////////////////////////////////////////////////

var c_p3Options = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Chave',
        data: 'chave', // note: access nested data like this
        className: '',
    }, {
        title: 'Mês/Ano',
        data: 'mesAno', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Quantidade',
        data: 'count', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fatura',
        data: 'fatura.valor', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'P3',
        data: 'p3', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='p3_view' class='glyphicon glyphicon-eye-open js-view' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='p3_edit' class='glyphicon glyphicon-usd js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "30%",
        "targets": 1
    }, {
        type: 'monthYear',
        targets: 3
    }, {
        "width": "0.1%",
        "targets": 7
    }, {
        "width": "0.1%",
        "targets": 8
    }, {
        "width": "0em",
        "targets": 9
    }],
    searching: false,
    autoWidth: true,
    bInfo: true,

    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
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
                valorMongo(i) :
                // replace(/[\$,]/g, '') * 1 :
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
        total = numeral(total).format('$0,0.00')
        pageTotal = numeral(pageTotal).format('$0,0.00')
        $(".dataTables_wrapper > .footer").html(
            pageTotal + ' (' + total + ' Total)'
        );
    },
    // ... see jquery.dataTables docs for more
};

function p3(operadora, interrupcoes, fatura) {
    var param = Parametros.findOne();
    var limite, diff, penalty;
    if (operadora == "OI") {
        limite = valorMongo(param.p3F1_O);
    } else {
        limite = valorMongo(param.p3F1_EA);
    };
    if (interrupcoes > limite) {
        if (operadora == "OI") {
            penalty = interrupcoes * valorMongo(fatura) * valorMongo(param.p3F2_O);
        } else {
            diff = interrupcoes - limite;
            penalty = diff * valorMongo(param.p3F2_EA);
        };
        return numeral(penalty).format('$0,0.00');
    };
    return false;
};

function getDistinctChave() {
    var data = Ocorrencias.find().fetch();
    var distinctData = _.uniq(data, false, function(d) {
        return d.chave
    });
    return _.pluck(distinctData, "chave");
};

function P3() {
    var penalidade, penalidades;
    var ocorrencias = Ocorrencias.find().fetch();
    var mes, ano, mesAno;
    var mesJ, anoJ, mesAnoJ;
    var id, unidade, operadora, chamado, chave, ocorrencia, count, obj, objAux, fatura, faturaAux, bill, penalty, p3Antigo, p3AntigoAux, index, oco, ocoAntigo, penalidade, id;
    var idJ, unidadeJ, operadoraJ, chaveJ, ocorrenciaJ, aberturaJ;
    var operadoraObj, unidadeObj;
    var list = [];
    for (var i = 0; i < ocorrencias.length; i++) {
        var listAux = [];
        count = 1;
        ocorrencia = ocorrencias[i];
        id = ocorrencia._id
        mes = ocorrencia.abertura.substring(3, 5);
        ano = ocorrencia.abertura.substring(6, 10);
        unidade = ocorrencia.unidade.unidade_name;
        unidadeObj = ocorrencia.unidade;
        operadora = ocorrencia.operadora.operadora_name;
        operadoraObj = ocorrencia.operadora;
        chamado = ocorrencia.chamado;
        chave = ocorrencia.chave;
        mesAno = mes + "/" + ano;
        for (var j = 0; j < ocorrencias.length; j++) {
            ocorrenciaJ = ocorrencias[j];
            idJ = ocorrenciaJ._id
            mesJ = ocorrenciaJ.abertura.substring(3, 5);
            anoJ = ocorrenciaJ.abertura.substring(6, 10);
            unidadeJ = ocorrenciaJ.unidade.unidade_name;
            operadoraJ = ocorrenciaJ.operadora.operadora_name;
            chaveJ = ocorrenciaJ.chave;
            aberturaJ = ocorrenciaJ.abertura;
            mesAnoJ = mesJ + "/" + anoJ;
            if (mesAnoJ == mesAno && unidadeJ == unidade && operadoraJ == operadora && chaveJ == chave && id != idJ && ocorrenciaJ.responsabilidade == "OPERADORA") {
                listAux.push(ocorrenciaJ);
                count++;
            };
        };
        if (count > 1) {
            obj = {
                operadora: operadoraObj,
                unidade: unidadeObj,
                mesAno: mesAno,
                chave: chave,
                ocorrencia: [],
                count: count,
                fatura: "",
                p3: "",
            };
            list.push(obj);
            index = (list.length) - 1;
            oco = list[index].ocorrencia;
            oco.push(ocorrencia);
            for (var k = 0; k < listAux.length; k++) {
                oco.push(listAux[k]);
            };
        };
    };
    if (list.length > 0) {
        for (var m = 0; m < list.length; m++) {
            p3AntigoAux = PenalidadesP3.findOne({
                "operadora.operadora_name": list[m].operadora.operadora_name,
                "unidade.unidade_name": list[m].unidade.unidade_name,
                "mesAno": list[m].mesAno,
                "chave": list[m].chave,
            });
            if (!p3AntigoAux) {
                PenalidadesP3.insert({
                    operadora: list[m].operadora,
                    unidade: list[m].unidade,
                    chave: list[m].chave,
                    mesAno: list[m].mesAno,
                    ocorrencia: list[m].ocorrencia,
                    count: list[m].count,
                    fatura: "",
                    p3: "",
                    criadoEm: dataEHora(),
                    criadoPor: Meteor.user(),
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                });
            };
        };
    };
    var penalidades = PenalidadesP3.find().fetch();
    for (var y = 0; y < penalidades.length; y++) {
        penalidade = penalidades[y];
        bill = "";
        penalty = "";
        faturaAux = Faturas.findOne({
            "unidade.unidade_name": penalidade.unidade.unidade_name,
            "operadora.operadora_name": penalidade.operadora.operadora_name,
            "feixe": penalidade.chave,
            "mesAno": penalidade.mesAno,
        });
        id = penalidade._id;
        if (faturaAux) {
            bill = faturaAux.valor;
            penalty = p3(penalidade.operadora.operadora_name, penalidade.count, bill);
            PenalidadesP3.update(id, {
                $set: {
                    fatura: faturaAux,
                    p3: penalty,
                },
            });
        } else {
            PenalidadesP3.update(id, {
                $set: {
                    fatura: {
                        _id: "",
                        valor: ""
                    },
                    p3: "",
                },
            });
        };
    };
};

var c_p3Data = function() {
    return PenalidadesP3.find().fetch();
};

Template.c_p3.helpers({
    c_p: c_p,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    reactiveDataFunction: function() {
        return c_p3Data;
    },
    c_p3Options: c_p3Options,
});

Template.c_p3.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#bread_2").html("Penalidades");
    $("#bread_3").html("P3");
};

Template.c_p3.events({
    'click #c_p_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        $("#findUnidade").val("");
        $("#findOperadora").val("");
        $("#findMesAno").val("");
        return false;
    },
    'click #c_p_action_elaborate': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var penalidades = PenalidadesP3.find().fetch();
        var operadora = $("#findOperadora").val();
        var unidade = $("#findUnidade").val();
        var mesAno = $("#findMesAno").val();
        var penalidade, criteria;
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < penalidades.length; i++) {
            criteria = true;
            penalidade = penalidades[i];
            if (operadora != "") {
                if (penalidade.operadora.operadora_name == operadora) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (unidade != "") {
                if (penalidade.unidade.unidade_name == unidade) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (mesAno != "") {
                if (penalidade.mesAno == mesAno) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    penalidade
                );
            };
        };
        return false;
    },
    'click #c_p_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var penalidades = PenalidadesP3.find().fetch();
        var operadora = $("#findOperadora").val();
        var unidade = $("#findUnidade").val();
        var mesAno = $("#findMesAno").val();
        var penalidade, criteria, pTotal;
        var list = [];
        var obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Chave: "Chave",
            MesAno: "Mês/Ano",
            Quantidade: "Quantidade",
            Fatura: "Fatura",
            P3: "P3",
        };
        list.push(obj);
        var pRel = 0;
        for (var i = 0; i < penalidades.length; i++) {
            criteria = true;
            penalidade = penalidades[i];
            if (operadora != "") {
                if (penalidade.operadora.operadora_name == operadora) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (unidade != "") {
                if (penalidade.unidade.unidade_name == unidade) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (mesAno != "") {
                if (penalidade.mesAno == mesAno) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                obj = {
                    Operadora: penalidade.operadora.operadora_name,
                    Unidade: penalidade.unidade.unidade_name,
                    Chave: penalidade.chave,
                    MesAno: penalidade.mesAno,
                    Quantidade: penalidade.count,
                    Fatura: penalidade.fatura,
                    P3: penalidade.p3,
                };
                pTotal = penalidade.p3,
                    pTotal = pTotal.replace("R$", "").replace(",", ";").replace(".", "").replace(";", ".");
                pRel += Number(pTotal);
                list.push(obj);
            };
        };
        obj = {
            Operadora: "",
            Unidade: "",
            Chave: "",
            MesAno: "",
            Quantidade: "",
            Fatura: "TOTAL",
            P3: numeral(pRel).format('$0,0.00'),
        };
        list.push(obj);
        if (list.length == 2) {
            alert = $(".alert-warning");
            showHideAlert(alert);
        } else {
            JSONToCSVConvertor(list, "Penalidade_P3");
            $("#reg").text((list.length) - 2);
            alert = $(".alert-success");
            showHideAlert(alert);
        };
        return false;
    },


    'click .js-view': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = "m_oco";
        var reg = PenalidadesP3.findOne({
            _id: registroID
        });
        var unidade = reg.unidade.unidade_name;
        var operadora = reg.operadora.operadora_name;
        var chave = reg.chave;
        var mesAno = reg.mesAno;
        var mes = mesAno.substring(0, 2);
        var ano = mesAno.substring(3, 7);
        var ultimoDia = getDiasMA(mes, ano);
        var abertura = new Date(ano + "-" + mes + "-01T00:00:00-0300");
        var fechamento = new Date(ano + "-" + mes + "-" + ultimoDia + "T23:59:59-0300");
        Session.set('activeModal', href);
        m_oco.m_abertura = dataJS_BR(abertura);
        m_oco.m_finalizacao = dataJS_BR(fechamento);
        m_oco.m_unidade = unidade;
        m_oco.m_operadora = operadora;
        m_oco.m_chave = chave;
        m_oco.oco_pen = true;
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = "a_fat";
        var reg = PenalidadesP3.findOne({
            _id: registroID
        });
        var unidade = reg.unidade.unidade_name;
        var operadora = reg.operadora.operadora_name;
        var chave = reg.chave;
        Session.set('activeModal', href);
        a_fat.fat_unidade = unidade;
        a_fat.fat_operadora = operadora;
        a_fat.fat_feixe = chave;
        a_fat.fat_pen = true;
    },
});
////////////////////////////////////////////////////////////////////////////////

var c_p4Options = {
    columns: [{
        title: 'Operadora',
        data: 'oficio.operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'oficio.unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Feixe',
        data: 'oficio.feixe', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Tipo',
        data: 'oficio.tipo', // note: access nested data like this
        className: '',
    }, {
        title: 'Código',
        data: 'oficio.codigo', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Oficio',
        data: 'oficio.oficio', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Abertura',
        data: 'oficio.abertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Limite',
        data: 'limite', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Finalização',
        data: 'oficio.finalizacao', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'P4',
        data: 'p4', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "30%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 6
    }, {
        "width": "5%",
        "targets": 7
    }, {
        "width": "5%",
        "targets": 8
    }, {
        type: 'date-euro',
        "targets": 6
    }, {
        type: 'date-euro',
        "targets": 7
    }, {
        type: 'date-euro',
        "targets": 8
    }, {
        "width": "0em",
        "targets": 10
    }],
    searching: false,
    autoWidth: true,
    bInfo: true,

    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"footer"><"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
    "footerCallback": function(row, data, start, end, display) {
        var api = this.api(),
            data;
        // Remove the formatting to get integer data for summation
        var intVal = function(i) {
            return typeof i === 'string' ?
                valorMongo(i) :
                // replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                i : 0;
        };

        // Total over all pages
        total = api
            .column(9)
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Total over this page
        pageTotal = api
            .column(9, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Update footer
        total = numeral(total).format('$0,0.00')
        pageTotal = numeral(pageTotal).format('$0,0.00')
        $(".dataTables_wrapper > .footer").html(
            pageTotal + ' (' + total + ' Total)'
        );
    },

};

function p4_lim(feixe, tipo) {
    var limite;
    if (tipo == "1 - INSTALAÇÃO - NOVO" || tipo == "1 - INSTALAÇÃO") {
        if (feixe == "ANALÓGICO") {
            limite = 7;
        } else {
            limite = 30;
        };
    } else if (tipo == "2 - ALTERAÇÃO - AMPLIAÇÃO DE FEIXE" || tipo == "2 - ALTERAÇÃO") {
        limite = 7
    } else if (tipo == "2 - ALTERAÇÃO - MUDANÇA DE ENDEREÇO") {
        limite = 30
    };
    return limite;
};

function p4(operadora, feixe, tipo, abertura, finalizacao) {
    if (finalizacao != "" && finalizacao != null && finalizacao != undefined) {
        var limite = p4_lim(feixe, tipo);
        var periodo;
        var penalty;
        var p = Parametros.findOne();
        var operOI = Operadoras.findOne({
            "operadora_name": "OI",
        });
        periodo = Math.abs(dataMongo(finalizacao).getTime() - dataMongo(abertura).getTime());
        total = (Math.ceil(periodo / (1000 * 3600 * 24)) - limite);
        if (total > 0) {
            if (operadora.operadora_name == operOI.operadora_name) {
                penalty = total * valorMongo(p.p4F1_O) + valorMongo(p.p4F2_O);
                return penalty;
            } else {
                penalty = total * valorMongo(p.p4F1_EA) + valorMongo(p.p4F2_EA);
                return penalty;
            };
        };
    } else {
        return false;
    };
};

function P4() {
    var penalidade, penalidades;
    var oficios = Oficios.find().fetch();
    var oficio;
    for (var i = 0; i < oficios.length; i++) {
        var finalizacao = oficios[i].finalizacao;
        var tipo = oficios[i].tipo;
        if (finalizacao != null && finalizacao != "" && finalizacao != undefined) { //&& tipo != "3 - DESCONTRAT" && tipo != "3 - DESCONTRATAÇÃO") {
            var operadora = oficios[i].operadora;
            var feixe = oficios[i].feixe;
            var abertura = oficios[i].abertura;
            if (p4(operadora, feixe, tipo, abertura, finalizacao) && p4(operadora, feixe, tipo, abertura, finalizacao) > 0) {
                var p = p4(operadora, feixe, tipo, abertura, finalizacao);
                oficio = oficios[i];
                var p4Antigo = PenalidadesP4.findOne({
                    "oficio._id": oficio._id,
                });
                if (!p4Antigo) {
                    var limite = p4_lim(feixe, tipo);
                    var dataLim = addDays(dataMongo(abertura), limite);
                    PenalidadesP4.insert({
                        oficio: oficio,
                        limite: dataJS_BR(dataLim),
                        p4: numeral(p).format('$0,0.00'),
                        criadoEm: dataEHora(),
                        criadoPor: Meteor.user(),
                    });
                };
            };
        };
    };

};

var c_p4Data = function() {
    return PenalidadesP4.find().fetch();
};

Template.c_p4.helpers({
    c_p: c_p,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    reactiveDataFunction: function() {
        return c_p4Data;
    },
    c_p4Options: c_p4Options,
});

Template.c_p4.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#bread_2").html("Penalidades");
    $("#bread_3").html("P4");
};

Template.c_p4.events({
    'click #c_p_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        $("#findUnidade").val("");
        $("#findOperadora").val("");
        $("#findMesAno").val("");
        return false;
    },
    'click #c_p_action_elaborate': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var unidade = $("#findUnidade").val();
        var operadora = $("#findOperadora").val();
        var mesAno = $("#findMesAno").val();
        var mes = Number(mesAno.substring(0, 2));
        var ano = Number(mesAno.substring(3, 7));
        var penalidadesP4 = PenalidadesP4.find().fetch();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        var oficioList;
        var finalizacaoList;
        var mesList;
        var anoList;
        for (var i = 0; i < penalidadesP4.length; i++) {
            penalty = penalidadesP4[i];
            oficioList = penalty.oficio;
            if (unidade != "") {
                if (unidade != oficioList.unidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != oficioList.operadora.operadora_name) {
                    continue;
                };
            };
            if (mes != "") {
                finalizacaoList = dataMongo(oficioList.finalizacao);
                mesList = (finalizacaoList.getMonth()) + 1;
                anoList = finalizacaoList.getFullYear();
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            $("table[id*='DataTables']").dataTable().fnAddData(
                penalty
            );
        };
        return false;
    },
    'click #c_p_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var unidade = $("#findUnidade").val();
        var operadora = $("#findOperadora").val();
        var mesAno = $("#findMesAno").val();
        var mes = Number(mesAno.substring(0, 2));
        var ano = Number(mesAno.substring(3, 7));
        var penalidesP4 = PenalidadesP4.find().fetch();
        var list = [];
        var oficioList;
        var finalizacaoList;
        var mesList, anoList;
        var pTotal;
        var obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Feixe: "Feixe",
            Tipo: "Tipo",
            Código: "Código",
            Ofício: "Ofício",
            Abertura: "Abertura",
            Limite: "Limite",
            Finalização: "Finalização",
            P4: "P4",
        };
        list.push(obj);
        var pRel = 0;
        for (var i = 0; i < penalidesP4.length; i++) {
            penalty = penalidesP4[i];
            oficioList = penalty.oficio;
            if (unidade != "") {
                if (unidade != oficioList.unidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != oficioList.operadora.operadora_name) {
                    continue;
                };
            };
            if (mes != "") {
                finalizacaoList = dataMongo(oficioList.finalizacao);
                mesList = (finalizacaoList.getMonth()) + 1;
                anoList = finalizacaoList.getFullYear();
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            obj = {
                Operadora: oficioList.operadora.operadora_name,
                Unidade: oficioList.unidade.unidade_name,
                Feixe: oficioList.feixe,
                Tipo: oficioList.tipo,
                Código: oficioList.codigo,
                Ofício: oficioList.oficio,
                Abertura: oficioList.abertura,
                Limite: penalty.limite,
                Finalização: oficioList.finalizacao,
                P4: penalty.p4,
            };
            pTotal = penalty.p4,
                pTotal = pTotal.replace("R$", "").replace(",", ";").replace(".", "").replace(";", ".");
            pRel += Number(pTotal);
            list.push(obj);
        };
        obj = {
            Operadora: "",
            Unidade: "",
            Feixe: "",
            Tipo: "",
            Código: "",
            Ofício: "",
            Abertura: "",
            Limite: "",
            Finalização: "TOTAL",
            P4: numeral(pRel).format('$0,0.00'),
        };
        list.push(obj);
        if (list.length == 2) {
            alert = $(".alert-warning");
            showHideAlert(alert);
        } else {
            JSONToCSVConvertor(list, "Penalidade_P4");
            $("#reg").text((list.length) - 2);
            alert = $(".alert-success");
            showHideAlert(alert);
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

var c_p5Options = {
    columns: [{
        title: 'Operadora',
        data: 'relatorio.operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'relatorio.cgcUnidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Título',
        data: 'relatorio.titulo', // note: access nested data like this
        className: '',
    }, {
        title: 'Abertura',
        data: 'relatorio.dataAbertura', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Vencimento',
        data: 'relatorio.dataVencimento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Fechamento',
        data: 'relatorio.dataFechamento', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Meses',
        data: 'atraso', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Faturas',
        data: 'count', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Total',
        data: 'total', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'P5',
        data: 'p5', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='p5_edit' class='glyphicon glyphicon-usd js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "5%",
        "targets": 0
    }, {
        "width": "20%",
        "targets": 1
    }, {
        "width": "5%",
        "targets": 3
    }, {
        "width": "5%",
        "targets": 4
    }, {
        "width": "5%",
        "targets": 5
    }, {
        type: 'date-euro',
        "targets": 3
    }, {
        type: 'date-euro',
        "targets": 4
    }, {
        type: 'date-euro',
        "targets": 5
    }, {
        "width": "0.1%",
        "targets": 10
    }, {
        "width": "0em",
        "targets": 11
    }],
    searching: false,
    autoWidth: true,
    bInfo: true,

    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
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
                valorMongo(i) :
                // replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                i : 0;
        };

        // Total over all pages
        total = api
            .column(9)
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Total over this page
        pageTotal = api
            .column(9, {
                page: 'current'
            })
            .data()
            .reduce(function(a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        // Update footer
        total = numeral(total).format('$0,0.00')
        pageTotal = numeral(pageTotal).format('$0,0.00')
        $(".dataTables_wrapper > .footer").html(
            pageTotal + ' (' + total + ' Total)'
        );
    },
    // ... see jquery.dataTables docs for more
};

function p5(faturas, operadora) {
    var p = Parametros.findOne();
    var operOI = Operadoras.findOne({
        "operadora_name": "OI"
    });
    if (operadora.operadora_name == operOI.operadora_name) {
        return faturas * valorMongo(p.p5F_O) / 100;
    } else {
        return faturas * valorMongo(p.p5F_EA) / 100;
    };
};

function P5() {
    var penalidade, penalidades;
    var relatorios = Relatorios.find().fetch();
    var obj = [],
        fatList = [];
    var relatorio, faturaAux, penalidadeOld, penalidade, penalidades, fatura, faturas, mesPiso, mesTeto;
    var fechamento, vencimento, operadora, unidade, venceDia, venceMes, venceAno, fechaDia, fechaMes, fechaAno, meses, atraso, total, count, penalty, vence, fecha;
    for (var i = 0; i < relatorios.length; i++) {
        relatorio = relatorios[i];
        fechamento = relatorio.dataFechamento;
        if (fechamento != "") {
            vencimento = relatorio.dataVencimento;
            venceDia = Number(vencimento.substring(0, 2));
            venceMes = Number(vencimento.substring(3, 5));
            venceAno = Number(vencimento.substring(6, 10));
            vence = new Date(venceAno + "/" + venceMes + "/" + venceDia);
            fechaDia = Number(fechamento.substring(0, 2));
            fechaMes = Number(fechamento.substring(3, 5));
            fechaAno = Number(fechamento.substring(6, 10));
            fecha = new Date(fechaAno + "/" + fechaMes + "/" + fechaDia);
            if (fecha > vence) {
                penalidade = PenalidadesP5.findOne({
                    "relatorio._id": relatorio._id,
                });
                if (!penalidade) {
                    operadora = relatorio.operadora;
                    unidade = relatorio.cgcUnidade;
                    if (fechaAno > venceAno) {
                        meses = ((fechaAno - venceAno) - 1) * 12;
                        atraso = meses + fechaMes + (12 - venceMes);
                    } else {
                        if (fechaMes > venceMes) {
                            atraso = fechaMes - venceMes;
                        } else {
                            atraso = 1;
                        };
                    };
                    total = Number(0);
                    count = Number(0);
                    penalty = Number(0);
                    PenalidadesP5.insert({
                        relatorio: relatorio,
                        atraso: atraso,
                        fatura: fatList,
                        count: count,
                        total: numeral(total).format('$0,0.00'),
                        p5: numeral(penalty).format('$0,0.00'),
                        criadoEm: dataEHora(),
                        criadoPor: Meteor.user(),
                    });
                };
            };
        };
    };
    penalidades = PenalidadesP5.find().fetch();
    for (var ii = 0; ii < penalidades.length; ii++) {
        penalidade = penalidades[ii];
        fatList = penalidade.fatura;
        atraso = penalidade.atraso;
        operadora = penalidade.relatorio.operadora.operadora_name;
        unidade = penalidade.relatorio.cgcUnidade.unidade_name;
        venceMes = Number(penalidade.relatorio.dataVencimento.substring(3, 5));
        venceAno = Number(penalidade.relatorio.dataVencimento.substring(6, 10));
        fechaMes = Number(penalidade.relatorio.dataFechamento.substring(3, 5));
        fechaAno = Number(penalidade.relatorio.dataFechamento.substring(6, 10));
        total = 0;
        count = 0;
        if (venceAno == fechaAno) {
            mesTeto = fechaMes;
            mesPiso = venceMes;
            for (var m = mesPiso; m < mesTeto; m++) {
                fatura = Faturas.findOne({
                    "mesAno": monthYearBR(m + "/" + fechaAno),
                    "operadora.operadora_name": operadora,
                    "unidade.unidade_name": unidade,
                    "feixe": "",
                });
                if (fatura) {
                    total += valorMongo(fatura.valor);
                    count += 1;
                    fatList.push(fatura);
                };
            };
        } else {
            mesTeto = 12;
            mesPiso = venceMes;
            for (var m = mesPiso; m <= mesTeto; m++) {
                fatura = Faturas.findOne({
                    "mesAno": monthYearBR(m + "/" + venceAno),
                    "operadora.operadora_name": operadora,
                    "unidade.unidade_name": unidade,
                    "feixe": "",
                });
                if (fatura) {
                    total += valorMongo(fatura.valor);
                    count += 1;
                    fatList.push(fatura);
                };
            };
            mesTeto = fechaMes;
            mesPiso = 1;
            for (var m = mesPiso; m < mesTeto; m++) {
                fatura = Faturas.findOne({
                    "mesAno": monthYearBR(m + "/" + fechaAno),
                    "operadora.operadora_name": operadora,
                    "unidade.unidade_name": unidade,
                    "feixe": "",
                });
                if (fatura) {
                    total += valorMongo(fatura.valor);
                    count += 1;
                    fatList.push(fatura);
                };
            };
        };
        if (total != valorMongo(penalidade.total) && Number(count) != Number(penalidade.count)) {
            penalty = p5(total, operadora);
            PenalidadesP5.update(penalidade._id, {
                $set: {
                    count: count,
                    fatura: fatList,
                    total: numeral(total).format('$0,0.00'),
                    p5: numeral(penalty).format('$0,0.00'),
                    modificadoEm: dataEHora(),
                    modificadoPor: Meteor.user(),
                },
            });
        };
    };

};

var c_p5Data = function() {
    return PenalidadesP5.find().fetch();
};
Template.c_p5.helpers({
    c_p: c_p,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    reactiveDataFunction: function() {
        return c_p5Data;
    },
    c_p5Options: c_p5Options,
});

Template.c_p5.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#bread_2").html("Penalidades");
    $("#bread_3").html("P5");
};

Template.c_p5.events({
    'click #c_p_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        $("#findUnidade").val("");
        $("#findOperadora").val("");
        $("#findMesAno").val("");
        return false;
    },
    'click #c_p_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var unidade = $("#findUnidade").val();
        var operadora = $("#findOperadora").val();
        var mesAno = $("#findMesAno").val();
        var mes = Number(mesAno.substring(0, 2));
        var ano = Number(mesAno.substring(3, 7));
        var penalidadesP5 = PenalidadesP5.find().fetch();
        var list = [];
        var pTotal, penalty, relatorioList, finalizacaoList;
        var obj = {};
        obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Titulo: "Título",
            Descricao: "Descrição",
            Abertura: "Abertura",
            Vencimento: "Vencimento",
            Fechamento: "Fechamento",
            Atraso: "Atraso(meses)",
            Faturas: "Meses Faturados",
            Total: "Total Faturado",
            P5: "P5",
        };
        list.push(obj);
        var q = 0;
        var pRel = 0;
        for (var i = 0; i < penalidadesP5.length; i++) {
            penalty = penalidadesP5[i];
            relatorioList = penalty.relatorio;
            if (unidade != "") {
                if (unidade != relatorioList.cgcUnidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != relatorioList.operadora.operadora_name) {
                    continue;
                };
            };
            if (mes != "") {
                finalizacaoList = dataMongo(relatorioList.dataFechamento);
                mesList = (finalizacaoList.getMonth()) + 1;
                anoList = finalizacaoList.getFullYear();
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            obj = {
                Operadora: relatorioList.operadora.operadora_name,
                Unidade: relatorioList.cgcUnidade.unidade_name,
                Titulo: relatorioList.titulo,
                Descricao: relatorioList.descricao,
                Abertura: relatorioList.dataAbertura,
                Vencimento: relatorioList.dataVencimento,
                Fechamento: relatorioList.dataFechamento,
                Atraso: penalty.atraso,
                Faturas: penalty.count,
                Total: penalty.total,
                P5: penalty.p5,
            };
            q++;
            pTotal = penalty.p5;
            pTotal = pTotal.replace("R$", "").replace(",", ";").replace(".", "").replace(";", ".");
            pRel += Number(pTotal);
            list.push(obj);
        };
        obj = {
            Operadora: "",
            Unidade: "",
            Titulo: "",
            Descricao: "",
            Abertura: "",
            Vencimento: "",
            Fechamento: "",
            Atraso: "",
            Faturas: "",
            Total: "TOTAL",
            P5: numeral(pRel).format('$0,0.00'),
        };
        list.push(obj);
        if (q > 0) {
            JSONToCSVConvertor(list, "Penalidades P5");
            $("#reg").text(q);
            alert = $(".alert-success");
            showHideAlert(alert);
        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
        return false;
    },
    'click #c_p_action_elaborate': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var unidade = $("#findUnidade").val();
        var operadora = $("#findOperadora").val();
        var mesAno = $("#findMesAno").val();
        var mes = Number(mesAno.substring(0, 2));
        var ano = Number(mesAno.substring(3, 7));
        var penalidadesP5 = PenalidadesP5.find().fetch();
        var list = [];
        var penalty, finalizacaoList;
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < penalidadesP5.length; i++) {
            penalty = penalidadesP5[i];
            relatorioList = penalty.relatorio;
            if (unidade != "") {
                if (unidade != relatorioList.cgcUnidade.unidade_name) {
                    continue;
                };
            };
            if (operadora != "") {
                if (operadora != relatorioList.operadora.operadora_name) {
                    continue;
                };
            };
            if (mes != "") {
                finalizacaoList = dataMongo(relatorioList.dataFechamento);
                mesList = (finalizacaoList.getMonth()) + 1;
                anoList = finalizacaoList.getFullYear();
                if (mes != mesList || ano != anoList) {
                    continue;
                };
            };
            $("table[id*='DataTables']").dataTable().fnAddData(
                penalty
            );
        };
        return false;
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = "a_fat";
        var reg = PenalidadesP5.findOne({
            _id: registroID,
        });
        var unidade = reg.relatorio.cgcUnidade.unidade_name;
        var operadora = reg.relatorio.operadora.operadora_name;
        Session.set('activeModal', href);
        a_fat.fat_unidade = unidade;
        a_fat.fat_operadora = operadora;
        a_fat.fat_feixe = "";
        a_fat.fat_pen = true;
    },
});

////////////////////////////////////////////////////////////////////////////////

var a_imp = {
    imp_action_clean: "imp_action_clean",
    imp_action_save: "imp_action_save",
    imp_clean: "Limpar",
    imp_save: "Importar",
    imp_form: "imp_form",
    imp_reg: 0,
};

Template.a_imp.helpers({
    a_imp: a_imp,
    selectedOCO: function() {
        if (Meteor.user().profile.perfil.perfil_nome != "OFICIO" && Meteor.user().profile.perfil.perfil_nome != "AUDITORIA OFICIO") {
            return true;
        } else {
            return false;
        };
    },
    selectedOFI: function() {
        if (Meteor.user().profile.perfil.perfil_nome != "OCORRENCIA" && Meteor.user().profile.perfil.perfil_nome != "AUDITORA OCORRENCIA") {
            return true;
        } else {
            return false;
        };
    },
    selectedADM: function() {
        if (Meteor.user().profile.perfil.perfil_nome == "ADMIN" || Meteor.user().profile.perfil.perfil_nome == "AUDITORA ADMIN") {
            return true;
        } else {
            return false;
        };
    },
    isAudit: function() {
        return Meteor.user().profile.perfil.audit ? 'disabled' : '';
    },
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.a_imp.events({
    'click #imp_action_save': function(event) {
        $(".alert-danger").hide();
        $(".alert-warning").hide();
        $(".alert-success").hide();
        $(".alert-info").hide();
        var tipo = $('#inputTipo').val();
        var q = 0;
        var fileInput = document.getElementById('inputFile');
        var file = fileInput.files[0];
        if (tipo == "" || file == undefined) {
            alert = $(".alert-danger");
            showHideAlert(alert);
            // console.log("campos faltantes");
            return false;
        } else {
            modals.modalType = "import";
            modals.modalTitle = "Confirmação de Importação";
            modals.modalMessage = "Deseja realmente importar o arquivo?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, importar";
            Modal.show('popUp');
        };
        return false;
    },
});
////////////////////////////////////////////////////////////////////////////////

var a_fat = {
    id: this._id,
    fat_action_new: "fat_action_new",
    fat_action_new_href: "a_fat_novo",
    fat_action_edit_href: "a_fat_edit",
    fat_action_back_href: "a_fat",
    fat_action_clean: "fat_action_clean",
    fat_action_find: "fat_action_find",
    fat_action_export: "fat_action_export",
    fat_action_back: "fat_action_back",
    fat_action_edit: "fat_action_edit",
    fat_action_save: "fat_action_save",
    fat_action_remove: "fat_action_remove",
    fat_form: "fat_form",
    fat_edit_form: "fat_edit_form",
    fat_novo: "Criar nova fatura",
    fat_edit: "Editar",
    fat_save: "Gravar",
    fat_voltar: "Voltar",
    fat_remove: "Excluir",
    fat_limpar: "Limpar campos da pesquisa",
    fat_novo_limpar: "Limpar campos do formulário",
    fat_pesquisar: "Pesquisar faturas",
    fat_exportar: "Exportar faturas em CSV",
    fat_operadora: "",
    fat_mes: "",
    fat_ano: "",
    fat_unidade: "",
    fat_feixe: "",
    fat_valor: "",
    fat_mesAno: "",
    fat_pen: false,
    fat_nova: false,
    fat_operadora_temp: "",
    fat_unidade_temp: "",
};

var a_fatOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Chave',
        data: 'feixe', // note: access nested data like this
        className: '',
    }, {
        title: 'Mês/Ano',
        data: 'mesAno', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Valor',
        data: 'valor', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='a_fat_edit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "40%",
        "targets": 1
    }, {
        type: 'monthYear',
        targets: 3
    }, {
        "width": "0.1%",
        "targets": 5
    }, {
        "width": "0.1%",
        "targets": 6
    }, {
        "width": "0em",
        "targets": 7
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var a_fatAuditOptions = {
    columns: [{
        title: 'Operadora',
        data: 'operadora.operadora_name', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Unidade',
        data: 'unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Chave',
        data: 'feixe', // note: access nested data like this
        className: '',
    }, {
        title: 'Mês/Ano',
        data: 'mesAno', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Valor',
        data: 'valor', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "40%",
        "targets": 1
    }, {
        type: 'monthYear',
        targets: 3
    }, {
        "width": "0em",
        "targets": 5
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var a_fatData = function() {
    return Faturas.find().fetch();
};

var a_fat_dt = function() {
    if (Meteor.user().profile.perfil.audit) {
        return a_fatAuditOptions;
    } else {
        return a_fatOptions;
    };
};

Template.a_fat.helpers({
    a_fat: a_fat,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    reactiveDataFunction: function() {
        return a_fatData;
    },
    a_fatOptions: a_fat_dt,
    selectedOperadora: function(key) {
        return key == a_fat.fat_operadora ? 'selected' : '';
    },
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.a_fat.rendered = function() {
    if (a_fat.fat_pen) {
        $('#fat_action_find').click();
    } else {
        a_fat.fat_unidade = "";
        a_fat.fat_operadora = "";
        a_fat.fat_feixe = "";
    };
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#findFeixe").inputmask("(99) 9999-9999", {
        placeholder: " "
    });
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Faturas");
};

Template.a_fat.destroyed = function() {
    a_fat.fat_pen = false;
};

Template.a_fat.events({
    'click #fat_action_new': function(event) {
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
        a_fat.fat_nova = false;
    },
    'click #fat_action_clean': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        $("#findUnidade").val("");
        $("#findOperadora").val("");
        $("#findFeixe").val("");
        $("#findMesAno").val("");
        a_fat.fat_nova = false;
        return false;
    },
    'click #fat_action_export': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var unidade = $("#findUnidade").val();
        var feixe = $("#findFeixe").val();
        var operadora = $("#findOperadora").val();
        var mesAno = $("#findMesAno").val();
        var list = Faturas.find().fetch();
        var listAux = [];
        var obj = {};
        obj = {
            Operadora: "Operadora",
            Unidade: "Unidade",
            Feixe: "Feixe",
            Mês_Ano: "Mês/Ano",
            Valor: "Valor",
        };
        listAux.push(obj);
        var q = 0;
        if (unidade == "" && feixe == "" && operadora == "" && mesAno == "") {
            for (var j = 0; j < list.length; j++) {
                obj = {
                    Operadora: list[j].operadora.operadora_name,
                    Unidade: list[j].unidade.unidade_name,
                    Feixe: list[j].feixe,
                    Mês_Ano: list[j].mesAno,
                    Valor: list[j].valor
                };
                listAux.push(obj);
                q++;
            };
        } else {
            for (var i = 0; i < list.length; i++) {
                var criteria = true;
                if (unidade != "") {
                    if (list[i].unidade.unidade_name.includes(unidade)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (feixe != "") {
                    if (list[i].feixe == feixe) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (operadora != "") {
                    if (list[i].operadora.operadora_name == operadora) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (mesAno != "") {
                    if (list[i].mesAno == mesAno) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (criteria) {
                    obj = {
                        Operadora: list[i].operadora.operadora_name,
                        Unidade: list[i].unidade.unidade_name,
                        Feixe: list[i].feixe,
                        Mês_Ano: list[i].mesAno,
                        Valor: list[i].valor
                    };
                    listAux.push(obj);
                    q++;
                };
            };
        };

        if (q > 0) {
            JSONToCSVConvertor(listAux, "Faturas");
            $("#reg").text(q);
            alert = $(".alert-success");
            showHideAlert(alert);
        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
        a_fat.fat_nova = false;
        return false;
    },

    'click #fat_action_find': function(event) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var unidade = $("#findUnidade").val();
        var feixe = $("#findFeixe").val();
        var operadora = $("#findOperadora").val();
        var mesAno = $("#findMesAno").val();
        var list = Faturas.find().fetch();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        if (unidade == "" && feixe == "" && operadora == "" && mesAno == "") {
            for (var i = 0; i < list.length; i++) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    list[i]
                );
            };
        } else {
            for (var i = 0; i < list.length; i++) {
                var criteria = true;
                if (unidade != "") {
                    if (list[i].unidade.unidade_name.includes(unidade)) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (feixe != "") {
                    if (list[i].feixe == feixe) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (operadora != "") {
                    if (list[i].operadora.operadora_name == operadora) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (mesAno != "") {
                    if (list[i].mesAno == mesAno) {
                        criteria = criteria && true;
                    } else {
                        criteria = criteria && false;
                    };
                };
                if (criteria) {
                    $("table[id*='DataTables']").dataTable().fnAddData(
                        list[i]
                    );
                };
            };
        };
        a_fat.fat_nova = false;
        return false;
    },
    'click .js-edit': function(e, t) {
        var registroID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var reg = Faturas.findOne({
            _id: registroID
        });
        a_fat.id = registroID;
        a_fat.fat_operadora = reg.operadora.operadora_name;
        a_fat.fat_mesAno = reg.mesAno;
        a_fat.fat_mes = reg.mes;
        a_fat.fat_ano = reg.ano;
        a_fat.fat_unidade = reg.unidade.unidade_name;
        a_fat.fat_feixe = reg.feixe;
        a_fat.fat_valor = reg.valor;
        Session.set('activeModal', href);
        a_fat.fat_nova = false;
    },
    'click .js-remove': function(e, t) {
        $(".alert-info").hide();
        $(".alert-success").hide();
        $(".alert-warning").hide();
        var id = $(e.target).parent().parent().find('td:last').text();
        modals.modalType = "delFat";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover a ocorrência?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        Modal.show('popUp');
        a_fat.fat_nova = false;
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

function clearEditAlertsFaturas() {
    $(".alert-success").hide();
    $(".alert-danger").hide();
};

Template.a_fat_edit.helpers({
    a_fat: a_fat,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
                required: false,
            }, ]
        };
    },
    selectedOperadora: function(key) {
        return key == a_fat.fat_operadora ? 'selected' : '';
    },
});

Template.a_fat_edit.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('inputUnidade');
    autoComplete.autocomplete = 'off';
    $("#inputMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#inputFeixe").inputmask("(99) 9999-9999", {
        placeholder: " "
    });
    $("#inputValor").inputmask("currency", {
        radixPoint: ",",
        prefix: "R$"
    });
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Faturas");
};

Template.a_fat_edit.destroyed = function() {
    a_fat.fat_pen = false;
    a_fat.fat_operadora = "";
    a_fat.fat_unidade = "";
    a_fat.fat_feixe = "";
};

Template.a_fat_edit.events({
    'click #fat_action_new': function(event) {
        clearEditAlertsFaturas();
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
        a_fat.fat_nova = false;
    },
    'click #fat_action_back': function(event) {
        clearEditAlertsFaturas();
        var fat = Faturas.findOne({
            _id: a_fat.id,
        });
        var operadora = $("#inputOperadora").val();
        var mesAno = $("#inputMesAno").val();
        var valor = $("#inputValor").val();
        var chave = $("#inputFeixe").val();
        var unidade = $("#inputUnidade").val();
        if (a_fat.fat_nova) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (fat.operadora.operadora_name == operadora && fat.mesAno == mesAno && fat.valor == valor && fat.feixe == chave && fat.unidade.unidade_name == unidade) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backEditFat";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro da fatura. Tem certeza que deseja sair sem atualizar a fatura?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = a_fat.id;
            Modal.show('popUp');
        };
        a_fat.fat_nova = false;
    },
    'click #fat_action_save': function(event) {
        clearEditAlertsFaturas();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var operadora = $("#inputOperadora").val();
        var mesAno = $("#inputMesAno").val();
        var valor = $("#inputValor").val();
        if (unidade == "" || operadora == "" || mesAno == "" || valor == "" || valor == 0) {
            alert = $(".alert-danger");
            showHideAlert(alert);
        } else {
            modals.modalType = "editFat";
            modals.modalTitle = "Confirmação de Alteração";
            modals.modalMessage = "Tem certeza que deseja atualizar a fatura?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, atualizar";
            modals.modalId = a_fat.id;
            Modal.show('popUp');
        };
        return false;
    },
    'click #fat_action_remove': function(event) {
        clearEditAlertsFaturas();
        var id = a_fat.id;
        modals.modalType = "delFat2";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover a fatura?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        Modal.show('popUp');
        a_fat.fat_nova = false;
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.a_fat_novo.helpers({
    a_fat: a_fat,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
            }, ]
        };
    },
});

Template.a_fat_novo.rendered = function() {
    $('.datetimepicker').each(function() {
        $(this).datetimepicker({
            viewMode: 'months',
            format: 'MM/YYYY',
            locale: 'pt-br',
        });
    });
    var autoComplete = document.getElementById('inputUnidade');
    autoComplete.autocomplete = 'off';
    $("#inputMesAno").inputmask("99/2099", {
        placeholder: " "
    });
    $("#inputFeixe").inputmask("(99) 9999-9999", {
        placeholder: " "
    });
    $("#inputValor").inputmask("currency", {
        radixPoint: ",",
        prefix: "R$",
        placeholder: "0"
    });
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Faturas");
};

Template.a_fat_novo.destroyed = function() {
    a_fat.fat_pen = false;
    a_fat.fat_operadora = "";
    a_fat.fat_unidade = "";
    a_fat.fat_feixe = "";
};

Template.a_fat_novo.events({
    'click #fat_action_back': function(event) {
        var operadora = $("#inputOperadora").val();
        var mesAno = $("#inputMesAno").val();
        var valor = $("#inputValor").val();
        var chave = $("#inputFeixe").val();
        var unidade = $("#inputUnidade").val();
        if (a_fat.fat_nova) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (operadora == "" && mesAno == "" && valor == "" && chave == "" && unidade == "") {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backNewFat";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro da fatura. Tem certeza que deseja sair sem salvar a fatura?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = a_fat.id;
            Modal.show('popUp');
        };
    },
    'click #fat_action_clean': function(event) {
        $(".alert-danger").hide();
        $(".alert-success").hide();
        $("#inputUnidade").val("");
        $("#inputFeixe").val("");
        $("#inputOperadora").val("");
        $("#inputMesAno").val("");
        $("#inputValor").val("");
        a_fat.fat_nova = false;
    },
    'click #fat_action_save': function(event) {
        $(".alert-danger").hide();
        $(".alert-success").hide();
        var unidade = $("#inputUnidade").val();
        var feixe = $("#inputFeixe").val();
        var operadora = $("#inputOperadora").val();
        var mesAno = $("#inputMesAno").val();
        var valor = $("#inputValor").val();
        if (unidade == "" || operadora == "" || mesAno == "" || valor == "" || valor == 0) {
            alert = $(".alert-danger");
            showHideAlert(alert);
        } else {
            modals.modalType = "newFat";
            modals.modalTitle = "Confirmação de Cadastramento";
            modals.modalMessage = "Deseja realmente inserir a fatura?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, gravar";
            Modal.show('popUp');
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

var a_par = {
    a_par_save: "a_par_save",
    a_par_save_value: "Salvar Parâmetros",
    p1_form: "p1_form",
    p1_fatorEA_1_input: "p1_fatorEA_1_input",
    p1_fatorEA_1_value: "",
    p1_fatorEA_2_input: "p1_fatorEA_2_input",
    p1_fatorEA_2_value: "",
    p1_fatorO_1_input: "p1_fatorO_1_input",
    p1_fatorO_1_value: "",
    p1_fatorO_2_input: "p1_fatorO_2_input",
    p1_fatorO_2_value: "",
    p2_form: "p2_form",
    p2_fatorEA_1_input: "p2_fatorEA_1_input",
    p2_fatorEA_1_value: "",
    p2_fatorEA_2_input: "p2_fatorEA_2_input",
    p2_fatorEA_2_value: "",
    p2_fatorO_1_input: "p2_fatorO_1_input",
    p2_fatorO_1_value: "",
    p2_fatorO_2_input: "p2_fatorO_2_input",
    p2_fatorO_2_value: "",
    p3_form: "p3_form",
    p3_fatorEA_1_input: "p3_fatorEA_1_input",
    p3_fatorEA_1_value: "",
    p3_fatorEA_2_input: "p3_fatorEA_2_input",
    p3_fatorEA_2_value: "",
    p3_fatorO_1_input: "p3_fatorO_1_input",
    p3_fatorO_1_value: "",
    p3_fatorO_2_input: "p3_fatorO_2_input",
    p3_fatorO_2_value: "",
    p4_form: "p4_form",
    p4_fatorEA_1_input: "p4_fatorEA_1_input",
    p4_fatorEA_1_value: "",
    p4_fatorEA_2_input: "p4_fatorEA_2_input",
    p4_fatorEA_2_value: "",
    p4_fatorO_1_input: "p4_fatorO_1_input",
    p4_fatorO_1_value: "",
    p4_fatorO_2_input: "p4_fatorO_2_input",
    p4_fatorO_2_value: "",
    p5_form: "p5_form",
    p5_fatorEA_input: "p5_fatorEA_input",
    p5_fatorEA_value: "",
    p5_fatorO_input: "p5_fatorO_input",
    p5_fatorO_value: "",
};

Template.a_par.helpers({
    a_par: a_par,
    param: param,
    isAudit: function() {
        return Meteor.user().profile.perfil.audit ? 'disabled' : '';
    },
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});


Template.a_par.rendered = function() {
    $("#p1_fatorEA_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p1_fatorEA_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p1_fatorO_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p1_fatorO_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p2_fatorEA_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p2_fatorEA_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p2_fatorO_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p2_fatorO_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p3_fatorEA_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p3_fatorEA_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p3_fatorO_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p3_fatorO_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p4_fatorEA_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p4_fatorEA_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p4_fatorO_1_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p4_fatorO_2_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p5_fatorEA_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#p5_fatorO_input").inputmask("currency", {
        radixPoint: ",",
        placeholder: "0",
        prefix: "",
    });
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Parâmetros Penalidades");
};

Template.a_par.events({
    'click #a_par_save': function(event) {
        $(".alert-success").hide();
        $(".alert-danger").hide();
        var reg = Parametros.findOne();
        var p1F1_EA = $("#p1_fatorEA_1_input").val();
        var p1F2_EA = $("#p1_fatorEA_2_input").val();
        var p1F1_O = $("#p1_fatorO_1_input").val();
        var p1F2_O = $("#p1_fatorO_2_input").val();
        var p2F1_EA = $("#p2_fatorEA_1_input").val();
        var p2F2_EA = $("#p2_fatorEA_2_input").val();
        var p2F1_O = $("#p2_fatorO_1_input").val();
        var p2F2_O = $("#p2_fatorO_2_input").val();
        var p3F1_EA = $("#p3_fatorEA_1_input").val();
        var p3F2_EA = $("#p3_fatorEA_2_input").val();
        var p3F1_O = $("#p3_fatorO_1_input").val();
        var p3F2_O = $("#p3_fatorO_2_input").val();
        var p4F1_EA = $("#p4_fatorEA_1_input").val();
        var p4F2_EA = $("#p4_fatorEA_2_input").val();
        var p4F1_O = $("#p4_fatorO_1_input").val();
        var p4F2_O = $("#p4_fatorO_2_input").val();
        var p5F_EA = $("#p5_fatorEA_input").val();
        var p5F_O = $("#p5_fatorO_input").val();
        if (p1F1_EA == "" | p1F2_EA == "" | p1F1_O == "" | p1F2_O == "" | p2F1_EA == "" | p2F2_EA == "" | p2F1_O == "" | p2F2_O == "" | p3F1_EA == "" | p3F2_EA == "" | p3F1_O == "" | p3F2_O == "" | p4F1_EA == "" | p4F1_O == "" | p4F2_O == "" | p5F_EA == "" | p5F_O == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
            // console.log("Faltam parâmetros!");
        } else {
            modals.modalType = "editPar";
            modals.modalTitle = "Confirmação de Alteração";
            modals.modalMessage = "Tem certeza que deseja atualizar os parâmetros das penalidades?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, atualizar";
            modals.modalId = reg._id;
            Modal.show('popUp');
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

var a_usuOptions = {
    columns: [{
        title: 'Matrícula',
        data: 'username', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Nome',
        data: 'profile.nome', // note: access nested data like this
        className: '',
    }, {
        title: 'Unidade',
        data: 'profile.unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Perfil',
        data: 'profile.perfil.perfil_nome', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' data-page='a_usu_edit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>",
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "<a href='#' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>",
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "30%",
        "targets": 1
    }, {
        "width": "35%",
        "targets": 2
    }, {
        "width": "0.1%",
        "targets": 4
    }, {
        "width": "0.1%",
        "targets": 5
    }, {
        "width": "0em",
        "targets": 6
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var a_usuAuditOptions = {
    columns: [{
        title: 'Matrícula',
        data: 'username', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'Nome',
        data: 'profile.nome', // note: access nested data like this
        className: '',
    }, {
        title: 'Unidade',
        data: 'profile.unidade.unidade_name', // note: access nested data like this
        className: '',
    }, {
        title: 'Perfil',
        data: 'profile.perfil.perfil_nome', // note: access nested data like this
        className: 'dtItem_center',
    }, {
        title: 'ID',
        data: '_id',
        orderable: false,
        className: 'row_id',
    }, ],
    "columnDefs": [{
        "width": "30%",
        "targets": 1
    }, {
        "width": "35%",
        "targets": 2
    }, {
        "width": "0em",
        "targets": 4
    }],
    searching: false,
    autoWidth: true,
    "stateSave": true,
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros por página",
        "zeroRecords": "Nenhum registro encontrado",
        "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "0 registros",
        "infoFiltered": "(filtrados de _MAX_ registros)",
        "paginate": {
            "first": "Primeira",
            "last": "Última",
            "next": "Próxima",
            "previous": "Anterior"
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
    // ... see jquery.dataTables docs for more
};

var a_usu = {
    usu_form: "usu_form",
    usu_action_new: "usu_novo",
    usu_action_find: "usu_find",
    usu_action_clean: "usu_clean",
    usu_action_export: "usu_export",
    usu_pesquisar: "Pesquisar Usuários",
    usu_limpar: "Limpar Formulário de Usuários",
    usu_exportar: "Exportar Usuários",
    usu_action_new_href: "a_usu_new",
    usu_novo_form: "usu_novo_form",
    usu_novo: "Criar Usuário",
    usu_novo_action_save: "usu_novo_action_save",
    usu_novo_action_clean: "usu_novo_action_clean",
    usu_novo_action_back: "usu_novo_action_back",
    usu_novo_action_back_href: "a_usu",
    usu_novo_gravar: "Gravar",
    usu_novo_limpar: "Limpar",
    usu_novo_voltar: "Voltar",
    usu_action_edit_href: "a_usu_edit",
    usu_edit_form: "usu_edit_form",
    usu_edit_action_save: "usu_edit_action_save",
    usu_edit_action_remove: "usu_edit_action_remove",
    usu_edit_action_back: "usu_edit_action_back",
    usu_edit_remover: "Excluir",
    usu_novo: false,
    usu_id: "",
    usu_matricula: "",
    usu_nome: "",
    usu_unidade: "",
    usu_perfil: "",
    perfis: function() {
        return Perfis.find().fetch();
    },
};

var a_usuData = function() {
    return Meteor.users.find().fetch();
};

var a_usu_dt = function() {
    if (Meteor.user().profile.perfil.audit) {
        return a_usuAuditOptions;
    } else {
        return a_usuOptions;
    };
};

Template.a_usu.helpers({
    a_usu: a_usu,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
            }, ]
        };
    },
    a_usuOptions: a_usu_dt,
    reactiveDataFunction: function() {
        return a_usuData;
    },
    isNotAudit: function() {
        return Meteor.user().profile.perfil.audit ? false : true;
    },
});

Template.a_usu.rendered = function() {
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMatricula").inputmask("a999999", {
        placeholder: " "
    });
    $("#findNome").inputmask("a{*}", {
        placeholder: " "
    });
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Usuários");
};

function findUsuario(matricula, nome, unidade, perfil) {
    var usuarios = Meteor.users.find().fetch();
    var usuarioList = [];
    var usuario, matriculaDB, criteria;
    for (var i = 0; i < usuarios.length; i++) {
        criteria = true;
        usuario = usuarios[i];
        matriculaDB = usuario.username;
        if (matricula != "") {
            if (matriculaDB.includes(matricula)) {
                criteria = criteria && true;
            } else {
                criteria = criteria && false;
            };
        };
        if (nome != "") {
            if (usuario.profile.nome.includes(nome)) {
                criteria = criteria && true;
            } else {
                criteria = criteria && false;
            };
        };
        if (unidade != "") {
            if (usuario.profile.unidade.unidade_name.includes(unidade.toUpperCase())) {
                criteria = criteria && true;
            } else {
                criteria = criteria && false;
            };
        };
        if (perfil != "") {
            if (perfil == usuario.profile.perfil.perfil_nome) {
                criteria = criteria && true;
            } else {
                criteria = criteria && false;
            };
        };
        if (criteria) {
            usuarioList.push(usuario);
        };
    };
    return usuarioList;
};

function clearAlertsUsuarios() {
    $(".alert-info").hide();
    $(".alert-warning").hide();
    $(".alert-success").hide();
};

function reportUsuarios(matricula, nome, unidade, perfil) {
    var usuarioList = findUsuario(matricula, nome, unidade, perfil);
    var result = [];
    var usuHeader = {
        matricula: "Matricula",
        nome: "Nome",
        unidade: "Unidade",
        perfil: "Perfil"
    };
    var usuario, usuItem;
    result.push(usuHeader);
    if (usuarioList.length > 0) {
        for (var i = 0; i < usuarioList.length; i++) {
            usuario = usuarioList[i];
            usuItem = {
                matricula: usuario.username,
                nome: usuario.profile.nome,
                unidade: usuario.profile.unidade.unidade_name,
                perfil: usuario.profile.perfil.perfil_nome,
            };
            result.push(usuItem);
        };
        JSONToCSVConvertor(result, "Usuários");
    };
    return (usuarioList.length);
};

function addUsuario(matricula, nome, pass, unidade, perfil) {
    var unidadeObj = Unidades.findOne({
        "unidade_name": unidade
    });
    var perfilObj = Perfis.findOne({
        "perfil_nome": perfil
    });
    if (unidadeObj == undefined) {
        unidadeObj = "";
    };
    if (matricula != "" && nome != "" && pass != "" && unidadeObj != "" && perfilObj != "") {
        Accounts.createUser({
            username: matricula,
            password: pass,
            profile: {
                nome: nome,
                unidade: unidadeObj,
                perfil: perfilObj,
                criadoEm: dataEHora(),
                criadoPor: Meteor.user(),
                modificadoEm: dataEHora(),
                modificadoPor: Meteor.user(),
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        return true;
    };
    return false;
};

function editUsuario(id, unidade, perfil) {
    var unidadeObj = Unidades.findOne({
        "unidade_name": unidade
    });
    var perfilObj = Perfis.findOne({
        "perfil_nome": perfil
    });
    if (unidadeObj == undefined) {
        unidadeObj = "";
    };
    if (unidadeObj != "" && perfilObj != "" && id != "") {
        Meteor.users.update(id, {
            $set: {
                "profile.unidade": unidadeObj,
                "profile.perfil": perfilObj,
                "profile.modificadoEm": dataEHora(),
                "profile.modificadoPor": Meteor.user(),
            },
        });
        return true;
    };
    return false;
};

Template.a_usu.events({
    'click #usu_novo': function(event) {
        var href = $(event.target).attr("data-page");
        Session.set('activeModal', href);
        a_usu.usu_novo = false;
    },
    'click #usu_clean': function(event) {
        clearAlertsUsuarios();
        $("#findMatricula").val("");
        $("#findNome").val("");
        $("#findUnidade").val("");
        $("#findPerfil").val("");
        a_usu.usu_novo = false;
        return false;
    },
    'click #usu_find': function(event) {
        clearAlertsUsuarios();
        var matricula = $("#findMatricula").val();
        var nome = $("#findNome").val();
        var unidade = $("#findUnidade").val();
        var perfil = $("#findPerfil").val();
        var result = findUsuario(matricula, nome, unidade, perfil);
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < result.length; i++) {
            $("table[id*='DataTables']").dataTable().fnAddData(
                result[i]
            );
        };
        a_usu.usu_novo = false;
        return false;
    },
    'click #usu_export': function(event) {
        clearAlertsUsuarios();
        var matricula = $("#findMatricula").val();
        var nome = $("#findNome").val();
        var unidade = $("#findUnidade").val();
        var perfil = $("#findPerfil").val();
        var q = reportUsuarios(matricula, nome, unidade, perfil);
        if (q > 0) {
            $("#reg").text(q);
            alert = $(".alert-success");
            showHideAlert(alert);
        } else {
            alert = $(".alert-warning");
            showHideAlert(alert);
        };
        a_usu.usu_novo = false;
        return false;
    },
    'click .js-edit': function(e, t) {
        var userID = $(e.target).parent().parent().find('td:last').text();
        var href = $(e.target).attr("data-page");
        var user = Meteor.users.findOne({
            _id: userID
        });
        a_usu.usu_id = userID;
        a_usu.usu_matricula = user.username;
        a_usu.usu_nome = user.profile.nome;
        a_usu.usu_unidade = user.profile.unidade.unidade_name;
        a_usu.usu_perfil = user.profile.perfil.perfil_nome;
        a_usu.usu_novo = false;
        Session.set('activeModal', href);
    },
    'click .js-remove': function(e, t) {
        clearAlertsUsuarios();
        var id = $(e.target).parent().parent().find('td:last').text();
        modals.modalType = "delUsu";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover o usuário?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = id;
        a_usu.usu_novo = false;
        Modal.show('popUp');
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////
function clearEditAlertsUsuarios() {
    $(".alert-success").hide();
    $(".alert-danger").hide();
    $(".alert-info").hide();
    $(".alert-warning").hide();
};

Template.a_usu_edit.helpers({
    a_usu: a_usu,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
            }, ]
        };
    },
    selectedPerfil: function(key) {
        return key == a_usu.usu_perfil ? 'selected' : '';
    },
});

Template.a_usu_edit.rendered = function() {
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Usuários");
};

Template.a_usu_edit.events({
    'click #usu_novo': function(event) {
        clearEditAlertsUsuarios();
        var href = $(event.target).attr("data-page");
        a_usu.usu_novo = false;
        Session.set('activeModal', href);
    },
    'click #usu_novo_action_back': function(event) {
        clearEditAlertsUsuarios();
        var user = Meteor.users.findOne({
            _id: a_usu.usu_id,
        });
        var perfil = $("#findPerfil").val();
        var unidade = $("#findUnidade").val();
        if (a_usu.usu_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (user.profile.perfil.perfil_nome == perfil && user.profile.unidade.unidade_name == unidade) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backEditUsu";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro do usuário. Tem certeza que deseja sair sem atualizar o usuário?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = a_usu.usu_id;
            a_usu.usu_novo = false;
            Modal.show('popUp');
        };
    },
    'click #usu_edit_action_remove': function(event) {
        clearEditAlertsUsuarios();
        modals.modalType = "delUsu2";
        modals.modalTitle = "Confirmação de Exclusão";
        modals.modalMessage = "Tem certeza que deseja remover o usuário?";
        modals.modalNo = "Cancelar";
        modals.modalYes = "Sim, remover";
        modals.modalId = a_usu.usu_id;
        Modal.show('popUp');
        a_usu.usu_novo = false;
        return false;
    },
    'click #usu_edit_action_save': function(event) {
        clearEditAlertsUsuarios();
        var perfil = $("#findPerfil").val();
        var unidade = $("#findUnidade").val();
        if (perfil == "" || unidade == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
        } else {
            modals.modalType = "editUsu";
            modals.modalTitle = "Confirmação de Alteração";
            modals.modalMessage = "Tem certeza que deseja atualizar o usuário?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, gravar";
            modals.modalId = a_usu.usu_id;
            Modal.show('popUp');
        };
        a_usu.usu_novo = false;
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

function clearAlertsUsuarioNovo() {
    $(".alert-danger").hide();
    $(".alert-info").hide();
    $(".alert-success").hide();
    $(".alert-warning").hide();
}

Template.a_usu_new.helpers({
    a_usu: a_usu,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Unidades,
                field: "unidade_name",
                template: Template.unidades,
                matchAll: true,
            }, ]
        };
    },
});

Template.a_usu_new.rendered = function() {
    var autoComplete = document.getElementById('findUnidade');
    autoComplete.autocomplete = 'off';
    $("#findMatricula").inputmask("a999999", {
        placeholder: " "
    });
    $("#bread_2").html("Administrar");
    $("#bread_3").html("Usuários");
};

Template.a_usu_new.events({
    'click #usu_novo_action_clean': function(event) {
        clearAlertsUsuarioNovo();
        document.getElementById("usu_form").reset();
    },
    'click #usu_novo_action_back': function(event) {
        clearAlertsUsuarioNovo();
        var nome = $("#findNome").val();
        var matricula = $("#findMatricula").val();
        var perfil = $("#findPerfil").val();
        var unidade = $("#findUnidade").val();
        var pass1 = $("#findSenha1").val();
        var pass2 = $("#findSenha2").val();
        if (a_usu.usu_novo) {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else if (nome == "" && matricula == "" && perfil == "" && unidade == "" && pass1 == "" && pass2 == "") {
            var href = $(event.target).attr("data-page");
            Session.set('activeModal', href);
        } else {
            modals.modalType = "backNewUsu";
            modals.modalTitle = "Confirmação de Saída sem Gravação";
            modals.modalMessage = "Modificações foram realizadas no registro do usuário. Tem certeza que deseja sair sem salvar o usuário?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, sair";
            modals.modalId = a_usu.usu_id;
            Modal.show('popUp');
        };
        a_usu.usu_novo = false;
    },
    'click #usu_novo_action_save': function(event) {
        clearAlertsUsuarioNovo();
        event.preventDefault();
        var matricula = $("#findMatricula").val();
        var nome = $("#findNome").val();
        var perfil = $("#findPerfil").val();
        var unidade = $("#findUnidade").val();
        var pass1 = $("#findSenha1").val();
        var pass2 = $("#findSenha2").val();
        var status, alert;
        if (matricula == "" || nome == "" || perfil == "" || unidade == "" || pass1 == "" || pass2 == "") {
            alert = $(".alert-danger");
            showHideAlert(alert);
        } else if (pass1 != pass2) {
            alert = $(".alert-info");
            showHideAlert(alert);
        } else {
            modals.modalType = "newUser";
            modals.modalTitle = "Confirmação de Cadastramento";
            modals.modalMessage = "Deseja realmente inserir o usuário?";
            modals.modalNo = "Cancelar";
            modals.modalYes = "Sim, gravar";
            Modal.show('popUp');
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

var footer_data = {
    f_empresa: "Caixa Econômica Federal",
    f_sistema: "Sistema de Penalidades de Telefonia",
    f_version: "v.2.0.0 b.00",
};

Template.footer.helpers(footer_data);

////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
  $("table").css("width","auto");
});
