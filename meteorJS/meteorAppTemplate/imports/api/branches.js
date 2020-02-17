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

export const Branches = new Mongo.Collection('branches');

if (Meteor.isServer) {
    if (Branches.find().count() === 0) {
        Branches.insert({
            code: "0001",
            name: "NEW YORK, NY",
            codeName: "0001 / NEW YORK, NY",
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: "SYSTEM",
        });
    };
    Meteor.publish('branches', function branchesPublication() {
        return Branches.find();
    });
};

Meteor.methods({
    'branches.insert' (code, name, userId) {
        check(userId, String);
        Branches.insert({
            code: code,
            name: name.toUpperCase(),
            codeName: code + " / " + name.toUpperCase(),
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'branches.remove' (branchId) {
        check(branchId, String);
        Branches.remove(branchId);
    },
    'branches.edit' (branchId, code, name, status, userId) {
        check(branchId, String);
        check(userId, String);
        Branches.update(branchId,{
            $set: {
                code: code,
                name: name.toUpperCase(),
                codeName: code + " / " + name.toUpperCase(),
                status: status,
                editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                editedBy: userId,
            },
        });
    },
});
