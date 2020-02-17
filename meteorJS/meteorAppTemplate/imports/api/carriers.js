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

export const Carriers = new Mongo.Collection('carriers');

if (Meteor.isServer) {
    if (Carriers.find().count() == 0) {
        Carriers.insert({
            carrier: "AT&T",
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: "SYSTEM",
        });
        Carriers.insert({
            carrier: "VERIZON",
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: "SYSTEM",
        });
    };
    Meteor.publish('carriers', function carriersPublication() {
        return Carriers.find();
    });
}

Meteor.methods({
    'carriers.insert' (name, userId) {
        check(userId, String);
        Carriers.insert({
            carrier: name.toUpperCase(),
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'carriers.remove' (carrierId) {
        check(carrierId, String);
        Carriers.remove(carrierId);
    },
    'carriers.edit' (carrierId, name, status, userId) {
        check(carrierId, String);
        check(userId, String);
        Carriers.update(carrierId,{
            $set: {
                carrier: name.toUpperCase(),
                status: status,
                editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                editedBy: userId,
            },
        });
    },
});
