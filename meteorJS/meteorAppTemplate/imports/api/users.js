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
    Accounts
} from 'meteor/accounts-base';
import {
    Branches
} from './branches.js';


let dateFormat = require('dateformat');

export const Users = Meteor.users;

if (Meteor.isServer) {

    if (Branches.find().count() == 0) {
        Branches.insert({
            code: "0001",
            name: "NEW YORK, NY",
            codeName: "0001 / NEW YORK, NY",
            status: "ACTIVE",
            createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
            createdBy: "SYSTEM",
        });
    };
    const newYork = Branches.find({
      code: "0001",
    }).fetch();

    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: "gusw",
            password: "Brasil05",
            profile: {
                name: "Gustavo De Assis Watanabe",
                email: "gustavo.watanabe@gmail.com",
                branch: newYork[0]._id,
                access: "ADMIN",
                status: "ACTIVE",
                createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                createdBy: "SYSTEM",
                lastSuccess: "",
            },
        });
        Accounts.createUser({
            username: "admin",
            password: "admin",
            profile: {
                name: "Admin Test",
                email: "admin@test.com",
                branch: newYork[0]._id,
                access: "ADMIN",
                status: "ACTIVE",
                createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                createdBy: "SYSTEM",
                lastSuccess: "",
            },
        });
        Accounts.createUser({
            username: "audit",
            password: "audit",
            profile: {
                name: "Audit Test",
                email: "audit@test.com",
                branch: newYork[0]._id,
                access: "AUDIT",
                status: "ACTIVE",
                createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                createdBy: "SYSTEM",
                lastSuccess: "",
            },
        });
        Accounts.createUser({
            username: "incidents",
            password: "incidents",
            profile: {
                name: "Incidents Test",
                email: "incidents@test.com",
                branch: newYork[0]._id,
                access: "INCIDENTS",
                status: "ACTIVE",
                createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                createdBy: "SYSTEM",
                lastSuccess: "",
            },
        });
        Accounts.createUser({
            username: "reports",
            password: "reports",
            profile: {
                name: "Reports Test",
                email: "reports@test.com",
                branch: newYork[0]._id,
                access: "REPORTS",
                status: "ACTIVE",
                createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                createdBy: "SYSTEM",
                lastSuccess: "",
            },
        });
    };
    Meteor.publish('users', function usersPublication() {
        return Users.find();
    });
};

Meteor.methods({
    'users.insert' (name, branch, username, email, profile, userId) {
        check(userId, String);
        Accounts.createUser({
            username: username,
            password: "changeMe",
            profile: {
                name: name,
                email: email,
                branch: branch,
                access: profile,
                status: "ACTIVE",
                createdAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                createdBy: userId,
                lastSuccess: "",
            },
        });
    },
    'users.remove' (userId) {
        check(userId, String);
        Meteor.users.remove(userId);
    },
    'users.edit' (user, name, username, email, access, branchId, status, userId) {
        check(branchId, String);
        check(userId, String);
        Meteor.users.update(user, {
            $set: {
                "profile.name": name,
                username: username,
                "profile.email": email,
                "profile.access": access,
                "profile.branch": branchId,
                "profile.status": status,
                editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                editedBy: userId,
            },
        });
    },
    'users.setPass' (userId, newPass){
        check(userId, String);
        Accounts.setPassword(userId, newPass, {logout: false});
        Meteor.users.update(userId, {
            $set: {
                editedAt: dateFormat(new Date(), "UTC:mm/dd/yyyy HH:MM:ss"),
                editedBy: userId,
            },
        });
    },
    'users.setSuccess' (userId, dateTime){
      check(userId, String);
      Meteor.users.update(userId, {
          $set: {
              "profile.lastSuccess": dateTime,
          },
      });
    }
});
