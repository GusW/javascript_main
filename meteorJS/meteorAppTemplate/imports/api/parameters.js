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

export const Parameters = new Mongo.Collection('parameters');

if (Meteor.isServer) {
    if (Parameters.find().count() == 0) {
        Parameters.insert({
            penalty:"P1",
            factor01:99.00,
            factor02:0.10,
            factor03:98.88,
            factor04:0.01,
            createdAt:dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy:"SYSTEM",
        });
        Parameters.insert({
            penalty:"P2",
            factor01:8.00,
            factor02:1.00,
            factor03:8.00,
            factor04:1.00,
            createdAt:dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy:"SYSTEM",
        });
        Parameters.insert({
            penalty:"P3",
            factor01:1.00,
            factor02:300.00,
            factor03:1.00,
            factor04:0.01,
            createdAt:dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy:"SYSTEM",
        });
        Parameters.insert({
            penalty:"P4",
            factor01:100.00,
            factor02:0.00,
            factor03:100.00,
            factor04:100.00,
            createdAt:dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy:"SYSTEM",
        });
        Parameters.insert({
            penalty:"P5",
            factor01:0.30,
            factor02:0.30,
            factor03:0.00,
            factor04:0.00,
            createdAt:dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy:"SYSTEM",
        });
    };

    Meteor.publish('parameters', function parametersPublication() {
        return Parameters.find();
    });
};

Meteor.methods({
    'parameters.edit' (parameterId, factor01, factor02, factor03, factor04, userId){
        check(parameterId, String);
        check(userId, String);
        Parameters.update(parameterId, {
          $set : {
              factor01:factor01,
              factor02:factor02,
              factor03:factor03,
              factor04:factor04,
              editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
              editedBy: userId,
          },
        });
    },
});
