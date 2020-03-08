import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';
import {
    Penalties4
} from './penalties4.js';
import {
    Parameters
} from './parameters.js';
import {
    Carriers
} from './carriers.js';

let dateFormat = require('dateformat');

export const Circulars = new Mongo.Collection('circulars');

if (Meteor.isServer) {
    Meteor.publish('circulars', function circularsPublication() {
        return Circulars.find();
    });
};

Meteor.methods({
    'circulars.insert' (carrierId, branchId, code, number, bundle, type, oDate, userId) {
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Circulars.insert({
            carrier: carrierId,
            branch: branchId,
            code: code,
            number: number,
            bundle: bundle,
            type: type,
            oDate: oDate,
            cDate: "",
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'circulars.remove' (circularId) {
        check(circularId, String);
        Circulars.remove(circularId);
    },
    'circulars.edit' (circularId, carrierId, branchId, code, number, bundle, type, oDate, cDate, status, userId){
        check(circularId, String);
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Circulars.update(circularId, {
          $set : {
              carrier: carrierId,
              branch: branchId,
              code: code,
              number: number,
              bundle: bundle,
              type: type,
              oDate: oDate,
              cDate: cDate,
              status: status,
              editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
              editedBy: userId,
          },
        });
    },
});
