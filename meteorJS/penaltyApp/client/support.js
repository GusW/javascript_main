
function validaDataBR(data) {
    if (data.length != 10) {
        return false;
    };
    var dia = data.substring(0, 2);
    var mes = data.substring(3, 5);
    var ano = data.substring(6, 10);
    console.log(dia + mes + ano);
    if (!Number(dia)) {
        return false;
    } else if (Number(dia) <= 0 || Number(dia) > 31){
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
        var mongoDate = new Date(ano + "-" + mes + "-" + dia);
        return mongoDate;
    }
    return false;
};

function mongo_dataBR(data){
    return dateFormat(data, "dd/mm/yyyy");
};

function validaMesAnoBR(data) {
    if (data.length != 7) {
        return false;
    };
    var mes = data.substring(0, 2);
    var ano = data.substring(3, 7);
    console.log(mes + ano);
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
    var mA = validaMesAnoBR(data);
    var dia = 2;
    var mes = mA.mes;
    var ano = mA.ano;
    if (mes && ano) {
        var dateFormat = require('dateformat');
        var mongoDate = new Date(ano + "-" + mes + "-" + dia);
        return dateFormat(mongoDate, "mm/yyyy");
    };
    return false;
};

function mongo_mesAnoBR(data) {
    var mes = data.getMonth();
    var ano = data.getFullYear();
    var mesAno = mes + "/" + ano;
    console.log("mesAno: " + mesAno);
    return mesAno;
}
