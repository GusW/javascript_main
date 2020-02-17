import {
    Meteor
} from 'meteor/meteor';

import {
    Accounts
} from 'meteor/accounts-base';

import '/node_modules/xlsx/xlsx.js';

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

function validaDataBR(data) {
    if (data.length != 10) {
        return false;
    };
    var dia = data.substring(0, 2);

    var mes = data.substring(3, 5);
    var ano = data.substring(6, 10);
    if (!Number(dia)) {
        return false;
    } else if (Number(dia) <= 0 || Number(dia) > 31) {
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

function validaMesAnoBR(data) {
    if (data.length != 7) {
        return false;
    };
    var mes = data.substring(0, 2);
    var ano = data.substring(3, 7);
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

var dateFormat = require('dateformat');

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

function mesAnoBR_mongo(data) {
    var mA = validaMesAnoBR(data);
    var mes = mA.mes;
    var ano = mA.ano;
    if (mes && ano) {
        var mongoDate = new Date(ano + "-" + mes + "T00:00:00");
        return dateFormat(mongoDate, "mm/yyyy");
    };
    return false;
};

function dataJS_BR(data) {
    var data2 = new Date(data);
    var dia = String(data2.getDate());
    var mes = String(data2.getMonth() + 1);
    var ano = String(data2.getFullYear());
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
    var ano = data3.getFullYear() + 100;
    if (dia < 10) {
        dia = "0" + dia;
    };
    if (mes < 10) {
        mes = "0" + mes;
    };
    var horas = data3.getUTCHours();
    var minutos = data3.getMinutes();
    var segundos = data3.getSeconds();
    console.log(segundos);
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

function valorMongo(valor) {
    return Number(valor).replace("R$", "").replace(".", "").replace(",", ".");
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
};

function dataEHora() {
    var agora = new Date();
    return dateFormat(agora, "dd/mm/yyyy HH:MM:ss");
}

Operadoras = new Mongo.Collection("operadoras");
Operadoras.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Oficios = new Mongo.Collection("oficios");
Oficios.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Ocorrencias = new Mongo.Collection("ocorrencias");
Ocorrencias.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Relatorios = new Mongo.Collection("relatorios");
Relatorios.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Unidades = new Mongo.Collection("unidades");
Unidades.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Faturas = new Mongo.Collection("faturas");
Faturas.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Parametros = new Mongo.Collection("parametros");
Parametros.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Perfis = new Mongo.Collection("perfis");
Perfis.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

PenalidadesP5 = new Mongo.Collection('penalidadesP5');
PenalidadesP5.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

PenalidadesP4 = new Mongo.Collection('penalidadesP4');
PenalidadesP4.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

PenalidadesP3 = new Mongo.Collection('penalidadesP3');
PenalidadesP3.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

PenalidadesP2 = new Mongo.Collection('penalidadesP2');
PenalidadesP2.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

PenalidadesP1 = new Mongo.Collection('penalidadesP1');
PenalidadesP1.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Meteor.users.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Accounts.validateLoginAttempt(function(attemptInfo) {
    if (attemptInfo.type == 'resume') return true;
    if (attemptInfo.methodName == 'createUser') return false;
    return true;
});

Meteor.startup(() => {
    var today = dataJS_BR(new Date());

    //
    // LDAP_DEFAULTS.url = 'ldapcluster.corecaixa';
    // LDAP_DEFAULTS.dn = 'ou=people,o=caixa';
    // LDAP_DEFAULTS.port = '489';
    // LDAP_DEFAULTS.createNewUser = false;
    // LDAP_DEFAULTS.searchResultsProfileMap = [
    //     {
    //     resultKey: 'cn',
    //     profileProperty: 'name'
    //     }
    //     ,{
    //     resultKey: 'mail',
    //     profileProperty: 'phoneNumber'
    //     }
    // ];

    console.log("Faturas: " + Faturas.find().count());
    console.log("Ocorrencias: " + Ocorrencias.find().count());
    console.log("Oficios: " + Oficios.find().count());
    console.log("Relatorios: " + Relatorios.find().count());
    console.log("Unidades: " + Unidades.find().count());
    console.log("Operadoras: " + Operadoras.find().count());
    console.log("Perfis: " + Perfis.find().count());

    ////////////////////////////////////////////////////////////////////////////////

    var operadoraEMBRATEL_name = "EMBRATEL";
    var operadoraOI_name = "OI";
    var operadoraALGAR_name = "ALGAR";
    if (Operadoras.find().count() == 0) {
        Operadoras.insert({
            operadora_name: operadoraEMBRATEL_name,
        });
        Operadoras.insert({
            operadora_name: operadoraOI_name,
        });
        Operadoras.insert({
            operadora_name: operadoraALGAR_name,
        });
    };
    var operadoraEMBRATEL = Operadoras.findOne({
        "operadora_name": operadoraEMBRATEL_name
    });
    var operadoraOI = Operadoras.findOne({
        "operadora_name": operadoraOI_name
    });
    var operadoraALGAR = Operadoras.findOne({
        "operadora_name": operadoraALGAR_name
    });

    ////////////////////////////////////////////////////////////////////////////////

    if (Perfis.find().count() == 0) {
        Perfis.insert({
            perfil_nome: "ADMIN",
            audit: false,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
        Perfis.insert({
            perfil_nome: "OCORRENCIA",
            audit: false,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
        Perfis.insert({
            perfil_nome: "OFICIO",
            audit: false,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
        Perfis.insert({
            perfil_nome: "AUDITORIA ADMIN",
            audit: true,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
        Perfis.insert({
            perfil_nome: "AUDITORIA OCORRENCIA",
            audit: true,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
        Perfis.insert({
            perfil_nome: "AUDITORIA OFICIO",
            audit: true,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
    };
    var perfilObjADM = Perfis.findOne({
        "perfil_nome": "ADMIN"
    });
    var perfilObjOCO = Perfis.findOne({
        "perfil_nome": "OCORRENCIA"
    });
    var perfilObjOFI = Perfis.findOne({
        "perfil_nome": "OFICIO"
    });
    var perfilObjADMa = Perfis.findOne({
        "perfil_nome": "AUDITORIA ADMIN"
    });
    var perfilObjOCOa = Perfis.findOne({
        "perfil_nome": "AUDITORIA OCORRENCIA"
    });
    var perfilObjOFIa = Perfis.findOne({
        "perfil_nome": "AUDITORIA OFICIO"
    });

    ////////////////////////////////////////////////////////////////////////////////

    var unidade7435_name = "7435 - GITEC / SUPORTE TECNOLOGICO B HORIZONTE, MG";
    var unidade7435_name_sitel = "SUPORTE TECNOLOGICO B HORIZONTE, MG";
    if (Unidades.find().count() == 0) {
        Unidades.insert({
            unidade_name: unidade7435_name,
            unidade_name_sitel: unidade7435_name_sitel,
            criadoEm: dataEHora(),
            criadoPor: "",
            modificadoEm: dataEHora(),
            modificadoPor: "",
        });
    };
    var unidade7435 = Unidades.findOne({
        "unidade_name": unidade7435_name
    });

    ////////////////////////////////////////////////////////////////////////////////

    if (Meteor.users.find().count() == 0) {
        Accounts.createUser({
            username: "admin",
            email: "",
            password: "admin",
            profile: {
                nome: "Gustavo de Assis Watanabe",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                ultimoSucessoEm: today,
                ultimoFracassoEm: "",
            },
        });
        var userADMIN = Meteor.users.findOne({
            "profile.nome": "ADMIN"
        });
        Accounts.createUser({
            username: "ocorrencia",
            email: "",
            password: "ocorrencia",
            profile: {
                nome: "OCORRENCIA",
                unidade: unidade7435,
                perfil: perfilObjOCO,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: today,
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "oficio",
            email: "",
            password: "oficio",
            profile: {
                nome: "OFICIO",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: today,
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "auditadmin",
            email: "",
            password: "admin",
            profile: {
                nome: "AUDITORIA ADMIN",
                unidade: unidade7435,
                perfil: perfilObjADMa,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: today,
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "auditocorrencia",
            email: "",
            password: "ocorrencia",
            profile: {
                nome: "AUDITORIA OCORRENCIA",
                unidade: unidade7435,
                perfil: perfilObjOCOa,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: today,
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "auditoficio",
            email: "",
            password: "oficio",
            profile: {
                nome: "AUDITORIA OFICIO",
                unidade: unidade7435,
                perfil: perfilObjOFIa,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: today,
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p612867",
            email: "p612867@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Moab da Silva Lima",
                unidade: unidade7435,
                perfil: perfilObjOCO,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p703861",
            email: "p703861@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Marcus Vinicius Peroni Junior",
                unidade: unidade7435,
                perfil: perfilObjOCO,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p748315",
            email: "p748315@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Aline Salum do Nascimento",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p982355",
            email: "p982355@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Anderson Santos Machado",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p771094",
            email: "p771094@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Bernard Cardoso Oliveira",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p742210",
            email: "p742210@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Daisy Tatyane Lima",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p702144",
            email: "p702144@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Edgard Miranda Camara",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p696107",
            email: "p696107@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Felipe Fernandes dos Santos",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p743494",
            email: "p743494@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Irene Barreiros Gomes",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p747717",
            email: "p747717@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Nattiere Santos Pereira",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p692371",
            email: "p692371@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Rondineli de Brito Rosa",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p595249",
            email: "p595249@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Diego Sulivan Rodrigues",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p691022",
            email: "p691022@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Fernando Pereira Ramos",
                unidade: unidade7435,
                perfil: perfilObjOFI,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "c053089",
            email: "c053089@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Christiano Fonseca da Cruz",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "c120410",
            email: "c120410@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Jose Henrique de Oliveira",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "c027627",
            email: "c027627@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Edgard Antonio de Aguiar",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "c036732",
            email: "c036732@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Antonio Carlos Campos Lima",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "c058365",
            email: "c058365@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Daniel Meinberg Schmidt de Andrade",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p767229",
            email: "p767229@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Gustavo de Assis Watanabe",
                unidade: unidade7435,
                perfil: perfilObjADM,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p673075",
            email: "p673075@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Rafael Alfenas Coelho",
                unidade: unidade7435,
                perfil: perfilObjADMa,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
        Accounts.createUser({
            username: "p771147",
            email: "p771147@mail.caixa",
            password: "Brasil16",
            profile: {
                nome: "Igor Percy Egusquiza Torres",
                unidade: unidade7435,
                perfil: perfilObjADMa,
                criadoEm: today,
                criadoPor: userADMIN,
                modificadoEm: today,
                modificadoPor: userADMIN,
                ultimoSucessoEm: "",
                ultimoFracassoEm: "",
            },
        });
    };

    ////////////////////////////////////////////////////////////////////////////////

    if (Parametros.find().count() == 0) {
        Parametros.insert({
            p1F1_EA: numeral(99.00).format('0.0[0000]'),
            p1F2_EA: numeral(0.1).format('0.0[0000]'),
            p1F1_O: numeral(98.88).format('0.0[0000]'),
            p1F2_O: numeral(0.01).format('0.0[0000]'),
            p2F1_EA: numeral(8.00).format('0.0[0000]'),
            p2F2_EA: numeral(1.0).format('0.0[0000]'),
            p2F1_O: numeral(8.00).format('0.0[0000]'),
            p2F2_O: numeral(1.00).format('0.0[0000]'),
            p3F1_EA: numeral(1.00).format('0.0[0000]'),
            p3F2_EA: numeral(300.00).format('0.0[0000]'),
            p3F1_O: numeral(1.00).format('0.0[0000]'),
            p3F2_O: numeral(0.01).format('0.0[0000]'),
            p4F1_EA: numeral(100).format('0.0[0000]'),
            p4F2_EA: numeral(0).format('0.0[0000]'),
            p4F1_O: numeral(100).format('0.0[0000]'),
            p4F2_O: numeral(100).format('0.0[0000]'),
            p5F_EA: numeral(0.3).format('0.0[0000]'),
            p5F_O: numeral(0.3).format('0.0[0000]'),
        });
    };

    ////////////////////////////////////////////////////////////////////////////////
    //RELATÓRIOS

    const d01 = "02/06/2016";
    const d02 = "07/06/2016";
    const d03 = "12/06/2016";
    const d04 = "22/06/2016";
    const d05 = "02/07/2016";
    const d06 = "09/07/2016";
    const d07 = "15/07/2016";
    const d08 = "22/07/2016";
    const d09 = "02/08/2016";
    const d10 = "12/08/2016";
    if (Relatorios.find().count() == 0) {
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d01),
            dataVencimento: dataBR_mongo(d02),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 01",
            descricao: "Descricao 01",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d02),
            dataVencimento: dataBR_mongo(d03),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 01a",
            descricao: "Descricao 01a",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d03),
            dataVencimento: dataBR_mongo(d04),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 02",
            descricao: "Descricao 02",
            operadora: operadoraOI,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d04),
            dataVencimento: dataBR_mongo(d05),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 03",
            descricao: "Descricao 03",
            operadora: operadoraOI,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d05),
            dataVencimento: dataBR_mongo(d06),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 04",
            descricao: "Descricao 04",
            operadora: operadoraOI,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d06),
            dataVencimento: dataBR_mongo(d07),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 05",
            descricao: "Descricao 05",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d07),
            dataVencimento: dataBR_mongo(d08),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 06",
            descricao: "Descricao 06",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d08),
            dataVencimento: dataBR_mongo(d09),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 07",
            descricao: "Descricao 07",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d09),
            dataVencimento: dataBR_mongo(d10),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 08",
            descricao: "Descricao 08",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d01),
            dataVencimento: dataBR_mongo(d03),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 09",
            descricao: "Descricao 09",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d01),
            dataVencimento: dataBR_mongo(d04),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 10",
            descricao: "Descricao 10",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Relatorios.insert({
            dataAbertura: dataBR_mongo(d01),
            dataVencimento: dataBR_mongo(d05),
            dataFechamento: "",
            cgcUnidade: unidade7435,
            titulo: "Teste 11",
            descricao: "Descricao 11",
            operadora: operadoraEMBRATEL,
            status: "EM ANDAMENTO",
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
    };
    if (Relatorios.find().count() != 0) {
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
    };

    ////////////////////////////////////////////////////////////////////////////////
    //FATURAS

    const mA_0315 = "03/2015";
    const mA_0415 = "04/2015";
    const mA_0515 = "04/2015";
    const mA_0615 = "04/2015";
    const mA_0715 = "07/2015";
    const mA_0815 = "08/2015";
    const mA_0915 = "09/2015";
    const mA_1015 = "10/2015";
    const mA_1115 = "11/2015";
    const mA_1215 = "12/2015";
    const mA_0116 = "01/2016";
    const mA_0216 = "02/2016";
    const mA_0316 = "03/2016";
    
    const mA_0616 = "06/2016";
    const mA_0716 = "07/2016";
    const mA_0816 = "08/2016";
    const mA_0916 = "09/2016";
    const mA_1016 = "10/2016";
    const mA_1116 = "11/2016";
    const mA_1216 = "12/2016";

    const vF_01 = 1000.1;
    const vF_02 = 2000.1;
    const vF_03 = 3000.1;
    const vF_04 = 4000.1;
    const vF_05 = 5000.1;
    const vF_06 = 6000.1;
    const vF_07 = 7000.1;
    const vF_08 = 8000.1;
    const vF_09 = 9000.1;
    const vF_10 = 10000.1;
    if (Faturas.find().count() == 0) {
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0315),
            unidade: unidade7435,
            feixe: "(31) 3545-2713",
            valor: numeral(vF_02).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0415),
            unidade: unidade7435,
            feixe: "(31) 3545-2713",
            valor: numeral(vF_03).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0515),
            unidade: unidade7435,
            feixe: "(31) 3542-5498",
            valor: numeral(vF_01).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0615),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_01).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0715),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_02).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0815),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_03).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0915),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_04).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_1015),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_05).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_1115),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_06).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_1215),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_07).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraEMBRATEL,
            mesAno: mesAnoBR_mongo(mA_0116),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_08).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraOI,
            mesAno: mesAnoBR_mongo(mA_0216),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_09).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
        Faturas.insert({
            operadora: operadoraOI,
            mesAno: mesAnoBR_mongo(mA_0316),
            unidade: unidade7435,
            feixe: "",
            valor: numeral(vF_10).format('$0,0.00'),
            criadoEm: dataEHora(),
            criadoPor: userADMIN,
            modificadoEm: dataEHora(),
            modificadoPor: userADMIN,
        }, );
    };

    ////////////////////////////////////////////////////////////////////////////////
    //MÉTODOS
    return Meteor.methods({
        removeAllOperadoras: function() {
            return Operadoras.remove({});
        },
        removeAllOcorrencias: function() {
            return Ocorrencias.remove({});
        },
        removeAllOficios: function() {
            return Oficios.remove({});
        },
        removeAllParametros: function() {
            return Parametros.remove({});
        },
        removeAllRelatorios: function() {
            return Relatorios.remove({});
        },
        removeAllFaturas: function() {
            return Faturas.remove({});
        },
        removeAllUnidades: function() {
            return Unidades.remove({});
        },
        removeAllPerfis: function() {
            return Perfis.remove({});
        },
        removeAllP1: function() {
            return PenalidadesP1.remove({});
        },
        removeAllP2: function() {
            return PenalidadesP2.remove({});
        },
        removeAllP3: function() {
            return PenalidadesP3.remove({});
        },
        removeAllP4: function() {
            return PenalidadesP4.remove({});
        },
        removeAllP5: function() {
            return PenalidadesP5.remove({});
        },
        setPass: function(id, newPassword) {
            Accounts.setPassword(id, newPassword);
            return true;
        },
    });
});
