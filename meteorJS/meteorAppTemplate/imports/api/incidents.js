
import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';

let dateFormat = require('dateformat');

export const Incidents = new Mongo.Collection('incidents');

if (Meteor.isServer) {
    Meteor.publish('incidents', function incidentsPublication() {
        return Incidents.find();
    });
};

Meteor.methods({
    'incidents.insert' (carrierId, branchId, phone, contract, number, oDate, cDate, userId) {
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Incidents.insert({
            carrier: carrierId,
            branch: branchId,
            phone: phone,
            contract: contract,
            number: number,
            oDate: oDate,
            cDate: cDate,
            responsibility: "CARRIER",
            description: "",
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'incidents.remove' (incidentId) {
        check(incidentId, String);
        Incidents.remove(incidentId);
    },
    'incidents.edit' (incidentId, responsibility, description, status, userId){
        check(incidentId, String);
        check(userId, String);
        Incidents.update(incidentId, {
            $set : {
                responsibility: responsibility,
                description: description,
                status: status,
                editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                editedBy: userId,
            },
        });
    },
});
