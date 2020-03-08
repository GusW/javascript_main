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

export const Penalties3 = new Mongo.Collection('penalties3');

if (Meteor.isServer) {
    Meteor.publish('penalties3', function penalties3Publication() {
        return Penalties3.find();
    });
};

Meteor.methods({
    'penalties3.insert' (incidentId, userId) {
        check(incidentId, String);
        check(userId, String);
        Penalties3.insert({
            incident: incidentId,
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'penalties3.remove' (penaltyId) {
        check(penaltyId, String);
        Penalties3.remove(penaltyId);
    },
});
