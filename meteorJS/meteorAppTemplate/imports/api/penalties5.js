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

export const Penalties5 = new Mongo.Collection('penalties5');

if (Meteor.isServer) {
    Meteor.publish('penalties5', function penalties5Publication() {
        return Penalties5.find();
    });
};

Meteor.methods({
    'penalties5.insert' (reportId, userId) {
        check(reportId, String);
        check(userId, String);
        Penalties5.insert({
            report: reportId,
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'penalties5.remove' (penaltyId) {
        check(penaltyId, String);
        Penalties5.remove(penaltyId);
    },
});
