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

export const Penalties2 = new Mongo.Collection('penalties2');

if (Meteor.isServer) {
    Meteor.publish('penalties2', function penalties2Publication() {
        return Penalties2.find();
    });
};

Meteor.methods({
    'penalties2.insert' (incidentId, userId) {
        check(incidentId, String);
        check(userId, String);
        Penalties2.insert({
            incident: incidentId,
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'penalties2.remove' (penaltyId) {
        check(penaltyId, String);
        Penalties2.remove(penaltyId);
    },
});
