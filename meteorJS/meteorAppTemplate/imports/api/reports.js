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
    Invoices
} from './invoices.js';
import {
    Penalties5
} from './penalties5.js';

let dateFormat = require('dateformat');

export const Reports = new Mongo.Collection('reports');

if (Meteor.isServer) {
    Meteor.publish('reports', function reportsPublication() {
        return Reports.find();
    });
};

Meteor.methods({
    'reports.insert' (carrierId, branchId, oDate, dDate, title, description, userId) {
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Reports.insert({
            carrier: carrierId,
            branch: branchId,
            oDate: oDate,
            dDate: dDate,
            cDate: "",
            title: title,
            description: description,
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'reports.remove' (reportId) {
        check(reportId, String);
        Reports.remove(reportId);
    },
    'reports.edit' (reportId, carrierId, branchId, oDate, dDate, cDate, title, description, status, userId){
        check(reportId, String);
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Reports.update(reportId, {
          $set : {
              carrier: carrierId,
              branch: branchId,
              oDate: oDate,
              dDate: dDate,
              cDate: cDate,
              title: title,
              description: description,
              status: status,
              editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
              editedBy: userId,
          },
        });
    },
});
