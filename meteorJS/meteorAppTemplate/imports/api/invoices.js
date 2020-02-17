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

export const Invoices = new Mongo.Collection('invoices');

if (Meteor.isServer) {
    Meteor.publish('invoices', function invoicesPublication() {
        return Invoices.find();
    });
}

Meteor.methods({
    'invoices.insert' (carrierId, date, phone, value, branchId, userId) {
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Invoices.insert({
            carrier: carrierId,
            date: date,
            phone: phone,
            value: value,
            branch: branchId,
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'invoices.remove' (invoiceId) {
        check(invoiceId, String);
        Invoices.remove(invoiceId);
    },
    'invoices.edit' (invoiceId, carrierId, date, phone, value, branchId, status, userId){
        check(invoiceId, String);
        check(carrierId, String);
        check(branchId, String);
        check(userId, String);
        Invoices.update(invoiceId, {
          $set : {
              carrier:carrierId,
              date:date,
              phone:phone,
              value:value,
              branch:branchId,
              status:status,
              editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
              editedBy: userId,
          },
        });
    },
});
