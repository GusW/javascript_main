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

export const Penalties1 = new Mongo.Collection('penalties1');

if (Meteor.isServer) {
    Meteor.publish('penalties1', function penalties1Publication() {
        return Penalties1.find();
    });
};

Meteor.methods({
    'penalties1.insert' (incidentId, oDate, cDate, avail, userId) {
        check(incidentId, String);
        check(userId, String);
        Penalties1.insert({
            incident: incidentId,
            oDate: oDate,
            cDate: cDate,
            availability: avail,
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'penalties1.remove' (penaltyId) {
        check(penaltyId, String);
        Penalties1.remove(penaltyId);
    },
});
