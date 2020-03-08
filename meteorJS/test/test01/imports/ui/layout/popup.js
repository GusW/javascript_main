import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './popup.html';
import './alert.js';
var dateFormat = require('dateformat');

popup = {
    objectName: "",
    title: "",
    message: "",
    import: "Importing...",
    yes: "",
    no: "",
    type: "",
    popupId: "",
    back: "",
    pro: 0,
    width: "0%",
};

popupAux = {
    old: 0,
    param1: "",
    param2: "",
    param3: "",
    param4: "",
    param5: "",
    param6: "",
    param7: "",
    param8: "",
    param9: "",
    param10: "",
};

const alertClass = $(".alert");

function clearForm() {
    $("#btnClear").click();
};

Template.popup.created = function() {

};

Template.popup.rendered = function() {
    $(".progress").hide();
};

Template.popup.helpers({
    popup: popup,
});

Template.popup.events({

    'click #logOut': function(event) {
        Modal.hide();
        Meteor.logout();
        const href = "Login";
        Session.set('activeModal', href);
    },

    ////////////////////////////////////////////////////////////////////////////////

    'click #incidentEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #incidentEdit_Save': function(event) {
        Modal.hide();
        const responsibility = popupAux.param1;
        const old_resposibility = Incidents.findOne(popup.popupId).responsibility;
        const description = popupAux.param2;
        const status = popupAux.param3;
        const back = popup.back;
        Meteor.call('incidents.edit', popup.popupId, responsibility, description, status, Meteor.userId());
        if (status === "ACTIVE" && responsibility === "CARRIER") {
            const incidentId = popup.popupId;
            const oldP1 = Penalties1.find({incident:incidentId}).fetch();
            if (oldP1 !== undefined){
                for (let i = 0; i < oldP1.length; i++){
                      Meteor.call("penalties1.remove", oldP1[i]._id);
                }
            }
            serviceAvailability(incidentId);
            const hours = serviceRecovery(popup.popupId);
            if (hours) {
                const oldP2 = Penalties2.findOne({
                    incident: popup.popupId
                });
                if (oldP2 != undefined) {
                    Meteor.call("penalties2.remove", oldP2._id);
                }
                Meteor.call("penalties2.insert", popup.popupId, Meteor.userId());
            }
            const amount = monthlyInterruptions(popup.popupId);
            if (amount) {
                const oldP3 = Penalties3.findOne({
                    incident: popup.popupId
                });
                const old_incident = Incidents.findOne(popup.popupId);
                const old_carrier = old_incident.carrier;
                const old_branch = old_incident.branch;
                const old_contract = old_incident.contract;
                const old_phone = old_incident.phone;
                const old_date = dateFormat(old_incident.oDate, "mm/yyyy");
                let oldPenalty = false;
                const penalties = Penalties3.find().fetch();
                for (let i = 0; i < penalties.length; i++){
                    let new_incident = Incidents.findOne(penalties[i].incident);
                    if (old_incident._id !== new_incident._id && new_incident.carrier === old_carrier && new_incident.branch === old_branch && new_incident.contract === old_contract && new_incident.phone === old_phone && dateFormat(new_incident.oDate, "mm/yyyy") === old_date){
                        oldPenalty = true;
                    }
                };
                if (oldP3 != undefined) {
                    Meteor.call("penalties3.remove", oldP3._id);
                }
                if (! oldPenalty){
                    Meteor.call("penalties3.insert", popup.popupId, Meteor.userId());
                }
            }
        }
        if (status === "ACTIVE" && old_resposibility === "CARRIER" && responsibility !== "CARRIER"){
            const incidentId = popup.popupId;
            const antiqueP1 = Penalties1.find({incident:incidentId}).fetch();
            if (antiqueP1 !== undefined){
                for (let i = 0; i < antiqueP1.length; i++){
                      Meteor.call("penalties1.remove", antiqueP1[i]._id);
                }
            }
            const antiqueP2 = Penalties2.findOne({
                incident: popup.popupId
            });
            if (antiqueP2 !== undefined) {
                Meteor.call("penalties2.remove", antiqueP2._id);
            }
            const antique_incident = Incidents.findOne(popup.popupId);
            const antique_carrier = antique_incident.carrier;
            const antique_branch = antique_incident.branch;
            const antique_contract = antique_incident.contract;
            const antique_phone = antique_incident.phone;
            const antique_date = dateFormat(antique_incident.oDate, "mm/yyyy");
            const antique_penalties = Penalties3.find().fetch();
            for (let i = 0; i < antique_penalties.length; i++){
                let stock_incident = Incidents.findOne(antique_penalties[i].incident);
                if (stock_incident.carrier === antique_carrier && stock_incident.branch === antique_branch && stock_incident.contract === antique_contract && stock_incident.phone === antique_phone && dateFormat(stock_incident.oDate, "mm/yyyy") === antique_date){
                    let antique_P3 = Penalties3.findOne({incident:stock_incident._id});
                    if (antique_P3 !== undefined){
                        Meteor.call("penalties3.remove", antique_P3._id);
                        break;
                    }
                }
            };
            const amount = monthlyInterruptions(popup.popupId);
            if (amount) {
                Meteor.call("penalties3.insert", popup.popupId, Meteor.userId());
            }
        }
        alert.type = "alert-success";
        alert.message = "The Incident was successfully updated.";
        showHideAlert(alertClass);
        // fadeInModalBody(back);
    },

    ////////////////////////////////////////////////////////////////////////////////

    'click #circularDel': function(event) {
        Modal.hide();
        Meteor.call('circulars.remove', popup.popupId);
        alert.type = "alert-success";
        alert.message = "The Circular was successfully removed.";
        showHideAlert(alertClass);
    },
    'click #circularNew_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #circularNew_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const branch = popupAux.param2;
        const code = popupAux.param3;
        const number = popupAux.param4;
        const bundle = popupAux.param5;
        const type = popupAux.param6;
        const oDate = popupAux.param7;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = "The Circular was NOT saved because there is already a report for the same carrier, Branch, Opening and Closing Dates with the very same Title. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('circulars.insert', carrier, branch, code, number, bundle, type, oDate, Meteor.userId());
            alert.type = "alert-success";
            alert.message = "The Circular was successfully saved.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
            //clearForm();
        };
    },
    'click #circularEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #circularEdit_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const branch = popupAux.param2;
        const code = popupAux.param3;
        const number = popupAux.param4;
        const bundle = popupAux.param5;
        const type = popupAux.param6;
        const oDate = popupAux.param7;
        const cDate = popupAux.param8;
        const status = popupAux.param9;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = "The Circular was NOT updated because there is already a register for the same Code and Number. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('circulars.edit', popup.popupId, carrier, branch, code, number, bundle, type, oDate, cDate, status, Meteor.userId());
            if (status == "ACTIVE") {
                const penalty = p4_ready(popup.popupId);
                if (penalty) {
                    const oldP4 = Penalties4.findOne({
                        circular: popup.popupId
                    });
                    if (oldP4 != undefined) {
                        Meteor.call("penalties4.remove", oldP4._id);
                    }
                    Meteor.call("penalties4.insert", popup.popupId, Meteor.userId());
                }
            }
            alert.type = "alert-success";
            alert.message = "The Circular was successfully updated.";
            showHideAlert(alertClass);
            // fadeInModalBody(back);
        };
    },

    ////////////////////////////////////////////////////////////////////////////////

    'click #reportDel': function(event) {
        Modal.hide();
        Meteor.call('reports.remove', popup.popupId);
        alert.type = "alert-success";
        alert.message = "The Report was successfully removed.";
        showHideAlert(alertClass);
    },
    'click #reportNew_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #reportNew_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const branch = popupAux.param2;
        const oDate = popupAux.param3;
        const dDate = popupAux.param4;
        const title = popupAux.param5;
        const description = popupAux.param6;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = title.toUpperCase() + " was NOT saved because there is already a report for the same carrier, Branch, Opening and Closing Dates with the very same Title. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('reports.insert', carrier, branch, oDate, dDate, title, description, Meteor.userId());
            alert.type = "alert-success";
            alert.message = "The report was successfully saved.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
            //clearForm();
        };
    },
    'click #reportEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #reportEdit_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const oDate = popupAux.param2;
        const dDate = popupAux.param3;
        const cDate = popupAux.param4;
        const branch = popupAux.param5;
        const title = popupAux.param6;
        const description = popupAux.param7;
        const status = popupAux.param8;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = "The Report was NOT updated because there is already a register for the same carrier, Opening Date, Due Date, Branch and with the same Title. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('reports.edit', popup.popupId, carrier, branch, oDate, dDate, cDate, title, description, status, Meteor.userId());
            if (status == "ACTIVE") {
                if (cDate !== "" && new Date(cDate) > new Date(dDate)) {
                    const reportId = popup.popupId;
                    const oldP5 = Penalties5.findOne({
                        report: reportId
                    });
                    if (oldP5 != undefined) {
                        Meteor.call("penalties5.remove", oldP5._id);
                    }
                    Meteor.call("penalties5.insert", popup.popupId, Meteor.userId());
                }
            }
            alert.type = "alert-success";
            alert.message = "The Report was successfully updated.";
            showHideAlert(alertClass);
            // fadeInModalBody(back);
        };
    },

    ////////////////////////////////////////////////////////////////////////////////

    'click #importCIRCULARS': function(event) {
        $(".progress").show();
        var q = 0;
        let rate = 0;
        const files = fileInput.files;
        const file = files[0];
        var i, f, fi;
        var reader, name, data, workbook, sheet_name_list, worksheet, fileImport;
        var reg, type, bundle, code, number, branch, carrier, oDate, circularOld = 0;
        var carrierId, branchId;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            reader = new FileReader();
            name = f.name;
            reader.onload = function(e) {
                data = e.target.result;
                workbook = xlsx.read(data, {
                    type: 'binary'
                });
                sheet_name_list = workbook.SheetNames;
                if (sheet_name_list.indexOf("DIGITAL") == 0 && sheet_name_list.indexOf("ANALOG") == 1) {
                    sheet_name_list.forEach(function(y) { /* iterate through sheets */
                        worksheet = workbook.Sheets[y];
                        if (y == "DIGITAL" || y == "ANALOG") {
                            fileImport = xlsx.utils.sheet_to_json(worksheet);
                            for (fi = 0; fi < fileImport.length; fi++) {
                                reg = fileImport[fi];
                                type = reg["TYPE"];
                                if (y == "ANALOG") {
                                    bundle = "ANALOG";
                                } else {
                                    bundle = y;
                                }
                                code = Number(reg["COD"]);
                                number = reg["NUMBER"];
                                branch = String(reg["BRANCH"]);
                                carrier = String(reg["CARRIER"]);
                                oDate = dateFormat(reg["OPENING"], "mm/dd/yyyy");
                                circularOld = Circulars.find({
                                    "code": code
                                }).count() + Circulars.find({
                                    "number": code
                                }).count();
                                if (circularOld == 0) {
                                    carrierId = Carriers.findOne({
                                        "carrier": carrier
                                    });
                                    branchId = Branches.findOne({
                                        "name": branch
                                    });
                                    if (carrierId && branchId){
                                        Meteor.call('circulars.insert', carrierId._id, branchId._id, code, number, bundle, type, oDate, Meteor.user()._id);
                                        q++;
                                    } else {
                                        console.log("ERROR: " + code + " / " +number);
                                    }
                                };
                                rate = (((fi + 1) / fileImport.length) * 100).toFixed(0);
                                $(".progress-bar").css("width", rate + "%");
                                $(".progress-bar").text(rate + "%");
                            };
                        };
                    });
                    if (q > 0) {
                        alert.type = "alert-success";
                        alert.message = "The Circular list was successfully imported with " + q + " register(s).";
                    } else {
                        alert.type = "alert-warning";
                        alert.message = "The Circular list was NOT imported: there is NO new Circular on this list.";
                    };
                } else {
                    alert.type = "alert-danger";
                    alert.message = "The workbook does NOT refer to a default Circular list. Please verify and try again.";
                };
                showHideAlert(alertClass);
                Modal.hide();
            };
            reader.readAsBinaryString(f);
        };
    },

    'click #importBRANCHES': function(event) {
        $(".progress").show();
        var q = 0;
        let rate = 0;
        const files = fileInput.files;
        const file = files[0];
        var i, f, fi;
        var reader, name, data, workbook, sheet_name_list, worksheet, fileImport;
        var reg, code, name, branchOld = 0;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            reader = new FileReader();
            name = f.name;
            reader.onload = function(e) {
                data = e.target.result;
                workbook = xlsx.read(data, {
                    type: 'binary'
                });
                sheet_name_list = workbook.SheetNames;
                if (sheet_name_list.indexOf("BRANCHES") == 0) {
                    sheet_name_list.forEach(function(y) {
                        worksheet = workbook.Sheets[y];
                        if (y == "BRANCHES") {
                            fileImport = xlsx.utils.sheet_to_json(worksheet);
                            for (fi = 0; fi < fileImport.length; fi++) {
                                reg = fileImport[fi];
                                code = reg["COD"];
                                name = reg["NAME"];
                                branchOld = Branches.find({
                                    "code": code
                                }).count() + Branches.find({
                                    "name": name
                                }).count();
                                if (branchOld == 0) {
                                    Meteor.call('branches.insert', code, name, Meteor.user()._id)
                                    q++;
                                };
                                rate = (((fi + 1) / fileImport.length) * 100).toFixed(0);
                                $(".progress-bar").css("width", rate + "%");
                                $(".progress-bar").text(rate + "%");
                            };
                        };
                    });
                    if (q > 0) {
                        alert.type = "alert-success";
                        alert.message = "The Branch list was successfully imported with " + q + " register(s).";
                    } else {
                        alert.type = "alert-warning";
                        alert.message = "The Branch list was NOT imported: there is NO new Branch on this list.";
                    };
                } else {
                    alert.type = "alert-danger";
                    alert.message = "The workbook does NOT refer to a default Branch list. Please verify and try again.";
                };
                showHideAlert(alertClass);
                Modal.hide();
            };
            reader.readAsBinaryString(f);
        };
        Modal.hide();
    },

    'click #importINCIDENTS': function(event) {
        $(".progress").show();
        let q = 0;
        let rate = 0;
        const files = fileInput.files;
        const file = files[0];
        let i, f, fi;
        let reader, name, data, workbook, sheet_name_list, worksheet, fileImport;
        let reg, branchCode, branchName, contract, number, branch, carrier, areaCode, phone, oDate, cDate, incidentOld = 0;
        let carrierId, branchId;
        let prefix, sufix;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            reader = new FileReader();
            name = f.name;
            reader.onload = function(e) {
                data = e.target.result;
                workbook = xlsx.read(data, {
                    type: 'binary'
                });
                sheet_name_list = workbook.SheetNames;
                if (sheet_name_list.indexOf("INCIDENTS") == 0) {
                    sheet_name_list.forEach(function(y) { /* iterate through sheets */
                        worksheet = workbook.Sheets[y];
                        if (y == "INCIDENTS") {
                            fileImport = xlsx.utils.sheet_to_json(worksheet);
                            for (fi = 0; fi < fileImport.length; fi++) {
                                reg = fileImport[fi];
                                branchCode = String(reg["BRANCH_COD"]);
                                branchName = String(reg["BRANCH_NAME"]);
                                carrier = String(reg["CARRIER"]);
                                contract = reg["T001_NU_CONTRACT"];
                                number = reg["T001_NU_INCIDENT"];
                                areaCode = reg["AREA_CODE"];
                                prefix = String(reg["NUM_KEY"]).substring(0,4);
                                sufix = String(reg["NUM_KEY"]).substring(4,8);
                                phone = "(" + areaCode + ") " + prefix + "-" + sufix;
                                oDate = dateFormat(reg["T001_DT_OPENING"], "mm/dd/yyyy");
                                cDate = dateFormat(reg["T001_DT_CLOSING"], "mm/dd/yyyy");
                                incidentOld = Incidents.find({
                                    "number": number,
                                    "contract": contract,
                                }).count();
                                if (incidentOld == 0) {
                                    carrierId = Carriers.findOne({
                                        "carrier": carrier
                                    });
                                    branchId = Branches.findOne({
                                        "name": branchName
                                    });
                                    if (carrierId && branchId){
                                        Meteor.call('incidents.insert', carrierId._id, branchId._id, phone, contract, number, oDate, cDate, Meteor.user()._id);
                                        const incidentId = Incidents.findOne({
                                            contract:contract,
                                            number:number,
                                        })._id;
                                        const oldP1 = Penalties1.find({incident:incidentId}).fetch();
                                        if (oldP1 !== undefined){
                                            for (let i = 0; i < oldP1.length; i++){
                                                  Meteor.call("penalties1.remove", oldP1[i]._id);
                                            }
                                        }
                                        serviceAvailability(incidentId);
                                        const hours = serviceRecovery(incidentId);
                                        const amount = monthlyInterruptions(incidentId);
                                        if (hours) {
                                            const oldP2 = Penalties2.findOne({
                                                incident: incidentId
                                            });
                                            if (oldP2 != undefined) {
                                                Meteor.call("penalties2.remove", oldP2._id);
                                            }
                                            Meteor.call("penalties2.insert", incidentId, Meteor.userId());
                                        }
                                        if (amount) {
                                            const oldP3 = Penalties3.findOne({
                                                incident: popup.popupId
                                            });
                                            const old_incident = Incidents.findOne(incidentId);
                                            const old_carrier = old_incident.carrier;
                                            const old_branch = old_incident.branch;
                                            const old_contract = old_incident.contract;
                                            const old_phone = old_incident.phone;
                                            const old_date = dateFormat(old_incident.oDate, "mm/yyyy");
                                            let oldPenalty = false;
                                            const penalties = Penalties3.find().fetch();
                                            for (let i = 0; i < penalties.length; i++){
                                                let new_incident = Incidents.findOne(penalties[i].incident);
                                                if (old_incident._id !== new_incident._id && new_incident.carrier === old_carrier && new_incident.branch === old_branch && new_incident.contract === old_contract && new_incident.phone === old_phone && dateFormat(new_incident.oDate, "mm/yyyy") === old_date){
                                                    oldPenalty = true;
                                                }
                                            };
                                            if (oldP3 != undefined) {
                                                Meteor.call("penalties3.remove", oldP3._id);
                                            }
                                            if (! oldPenalty){
                                                Meteor.call("penalties3.insert", incidentId, Meteor.userId());
                                            }
                                        }
                                        q++;
                                    } else {
                                        console.log("ERROR: " + contract + " / " + number);
                                    }
                                };
                                rate = (((fi + 1) / fileImport.length) * 100).toFixed(0);
                                $(".progress-bar").css("width", rate + "%");
                                $(".progress-bar").text(rate + "%");
                            };
                        };
                    });
                    if (q > 0) {
                        alert.type = "alert-success";
                        alert.message = "The Incident list was successfully imported with " + q + " register(s).";
                    } else {
                        alert.type = "alert-warning";
                        alert.message = "The Incident list was NOT imported: there is NO new Incident on this list.";
                    };
                } else {
                    alert.type = "alert-danger";
                    alert.message = "The workbook does NOT refer to a default Incident list. Please verify and try again.";
                };
                showHideAlert(alertClass);
                Modal.hide();
            };
            reader.readAsBinaryString(f);
        };
        Modal.hide();
    },

    ////////////////////////////////////////////////////////////////////////////////

    'click #invoiceNew_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #invoiceNew_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const date = popupAux.param2;
        const phone = popupAux.param3;
        const value = popupAux.param4;
        const branch = popupAux.param5;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = "The invoice was NOT saved because there is already an Invoice for the same carrier, to the same Date, Phone and Branch. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('invoices.insert', carrier, date, phone, value, branch, Meteor.userId());
            alert.type = "alert-success";
            alert.message = "The invoice was successfully saved.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
            //clearForm();
        }
    },
    'click #invoiceEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #invoiceEdit_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const date = popupAux.param2;
        const phone = popupAux.param3;
        const value = popupAux.param4;
        const branch = popupAux.param5;
        const status = popupAux.param6;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = "The Invoice was NOT updated because there is already a register for the same carrier, Date, Phone and Branch. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('invoices.edit', popup.popupId, carrier, date, phone, value, branch, status, Meteor.userId());
            alert.type = "alert-success";
            alert.message = "The Invoice was successfully updated.";
            showHideAlert(alertClass);
            fadeInModalBody(back);

        }
    },
    'click #invoiceDel': function(event) {
        Modal.hide();
        Meteor.call('invoices.remove', popup.popupId);
        alert.type = "alert-success";
        alert.message = "Invoice was successfully removed.";
        showHideAlert(alertClass);
    },

    ////////////////////////////////////////////////////////////////////////////

    'click #branchDel': function(event) {
        Modal.hide();
        const objectName = popup.objectName;
        Meteor.call('branches.remove', popup.popupId);
        alert.type = "alert-success";
        alert.message = objectName + " was successfully removed.";
        showHideAlert(alertClass);
    },
    'click #branchNew_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #branchNew_Save': function(event) {
        Modal.hide();
        const code = popupAux.param1;
        const name = popupAux.param2;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = String(name).toUpperCase() + " was NOT saved because there is already a Branch with the same Code/Name. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('branches.insert', code, name, Meteor.userId());
            alert.type = "alert-success";
            alert.message = String(name).toUpperCase() + " was successfully saved.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
        };
    },
    'click #branchEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #branchEdit_Save': function(event) {
        Modal.hide();
        const code = popupAux.param1;
        const name = popupAux.param2;
        const status = popupAux.param3;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-danger";
            alert.message = String(name).toUpperCase() + " was NOT updated because there is already a Branch with the same Code/Name. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('branches.edit', popup.popupId, code, name, status, Meteor.userId());
            alert.type = "alert-success";
            alert.message = String(name).toUpperCase() + " was successfully updated.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
        };
    },

    ////////////////////////////////////////////////////////////////////////////

    'click #carrierDel': function(event) {
        Modal.hide();
        Meteor.call('carriers.remove', popup.popupId);
        alert.type = "alert-success";
        alert.message = "carrier was successfully removed.";
        showHideAlert(alertClass);
    },
    'click #carrierNew_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #carrierNew_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-warning";
            alert.message = String(carrier).toUpperCase() + " was NOT saved because there is already a carrier with the same Name. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('carriers.insert', carrier, Meteor.userId());
            alert.type = "alert-success";
            alert.message = String(carrier).toUpperCase() + " was successfully saved.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
            // clearForm();
        };
    },
    'click #carrierEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #carrierEdit_Save': function(event) {
        Modal.hide();
        const carrier = popupAux.param1;
        const status = popupAux.param2;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-warning";
            alert.message = String(carrier).toUpperCase() + " was NOT updated because there is already a carrier with the same Name. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('carriers.edit', popup.popupId, carrier, status, Meteor.userId());
            alert.type = "alert-success";
            alert.message = String(carrier).toUpperCase() + " was successfully updated.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
        };
    },

    ////////////////////////////////////////////////////////////////////////////////

    'click #parameterEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #paremeterEdit_Save': function(event) {
        Modal.hide();
        const factor01 = popupAux.param1;
        const factor02 = popupAux.param2;
        const factor03 = popupAux.param3;
        const factor04 = popupAux.param4;
        const back = popup.back;
        Meteor.call('parameters.edit', popup.popupId, factor01, factor02, factor03, factor04, Meteor.userId());
        alert.type = "alert-success";
        alert.message = " The Parameter was successfully updated.";
        showHideAlert(alertClass);
        fadeInModalBody(back);
    },

    ////////////////////////////////////////////////////////////////////////////////
    'click #userDel': function(event) {
        Modal.hide();
        Meteor.call('users.remove', popup.popupId);
        alert.type = "alert-success";
        alert.message = "The User was successfully removed.";
        showHideAlert(alertClass);
    },
    'click #userNew_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #userNew_Save': function(event) {
        Modal.hide();
        const name = popupAux.param1;
        const branch = popupAux.param2;
        const username = popupAux.param3;
        const email = popupAux.param4;
        const profile = popupAux.param5;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-warning";
            alert.message = String(name).toUpperCase() + " was NOT saved because there is already an User with the same Name, Username and/or Email. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('users.insert', name, branch, username, email, profile, Meteor.userId());
            alert.type = "alert-success";
            alert.message = String(name).toUpperCase() + " was successfully saved.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
            //clearForm();
        }
    },
    'click #userEdit_Back': function(event) {
        Modal.hide();
        const back = popup.back;
        Session.set('activeModal', back);
    },
    'click #userEdit_Save': function(event) {
        Modal.hide();
        const name = popupAux.param1;
        const username = popupAux.param2;
        const email = popupAux.param3;
        const profile = popupAux.param4;
        const branch = popupAux.param5;
        const status = popupAux.param6;
        const back = popup.back;
        if (popupAux.old > 0) {
            alert.type = "alert-warning";
            alert.message = String(username).toUpperCase() + " was NOT updated because there is already an User with the same Name, Username or Email. Please verify and try again.";
            showHideAlert(alertClass);
        } else {
            Meteor.call('users.edit', popup.popupId, name, username, email, profile, branch, status, Meteor.userId());
            alert.type = "alert-success";
            alert.message = username.toUpperCase() + " was successfully updated.";
            showHideAlert(alertClass);
            fadeInModalBody(back);
        };
    },
});
