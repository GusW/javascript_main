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

export const Penalties4 = new Mongo.Collection('penalties4');

if (Meteor.isServer) {
    Meteor.publish('penalties4', function penalties4Publication() {
        return Penalties4.find();
    });
};

Meteor.methods({
    'penalties4.insert' (circularId, userId) {
        check(circularId, String);
        check(userId, String);
        Penalties4.insert({
            circular: circularId,
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: userId,
        });
    },
    'penalties4.remove' (penaltyId) {
        check(penaltyId, String);
        Penalties4.remove(penaltyId);
    },
});
