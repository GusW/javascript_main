import {
    Users
} from '../../api/users.js';
import {
    Branches
} from '../../api/branches.js';
import {
    Carriers
} from '../../api/carriers.js';
import {
    Circulars
} from '../../api/circulars.js';
import {
    Incidents
} from '../../api/incidents.js';
import {
    Invoices
} from '../../api/invoices.js';
import {
    Parameters
} from '../../api/parameters.js';
import {
    Reports
} from '../../api/reports.js';
import './user.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

const objectName = "User";

var object = {
    name: objectName,
    menu: "Settings",
    title: "Manage " + objectName,
    new: "UserNew",
    titleNew: "Create " + objectName,
    edit: "UserEdit",
    titleEdit: "Edit " + objectName,
    userName: "Full Name",
    userUsername: "Username",
    userEmail: "E-mail",
    userBranch: "Branch",
    userProfile: "Profile",
    userPass: "Password",
    inputName: "inputName",
    inputUsername: "inputUsername",
    inputEmail: "inputEmail",
    inputBranch: "inputBranch",
    inputProfile: "inputProfile",
    inputPass: "inputPass",
    status: "Status",
    inputStatus: "inputStatus",
};

var activeObject = {
    userName: "",
    userUsername: "",
    userEmail: "",
    userBranch: "",
    userProfile: "",
    userStatus: "",
};

var dtData = function() {
    return Meteor.users.find().fetch();
};

const alertClass = $(".alert");
const inputName = "#" + object.inputName;
const inputUsername = "#" + object.inputUsername;
const inputEmail = "#" + object.inputEmail;
const inputBranch = "#" + object.inputBranch;
const inputProfile = "#" + object.inputProfile;
const inputStatus = "#" + object.inputStatus;

function renderEditObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN" || Meteor.userId() === currentRow._id){
        return "<a href='#' id='" + currentRow._id + "' data-page='UserEdit' class='glyphicon glyphicon-pencil js-edit' style='text-decoration:none;color:black'></a>";
    }
    return null;
};

function renderRemoveObject(currentRow) {
    const accessProfile = Meteor.user().profile.access;
    if (accessProfile === "ADMIN" && Meteor.userId() !== currentRow._id){
        const branches = Branches.find({
            "createdBy": currentRow._id
        }).count() + Branches.find({
            "editedBy": currentRow._id
        }).count();
        const carriers = Carriers.find({
            "createdBy": currentRow._id
        }).count()+ Carriers.find({
            "editedBy": currentRow._id
        }).count();
        const circulars = Circulars.find({
            "createdBy": currentRow._id
        }).count()+ Circulars.find({
            "editedBy": currentRow._id
        }).count();
        const incidents = Incidents.find({
            "createdBy": currentRow._id
        }).count()+ Incidents.find({
            "editedBy": currentRow._id
        }).count();
        const invoices = Invoices.find({
            "createdBy": currentRow._id
        }).count()+ Invoices.find({
            "editedBy": currentRow._id
        }).count();
        const parameters = Parameters.find({
            "editedBy": currentRow._id
        }).count();
        const reports = Reports.find({
            "createdBy": currentRow._id
        }).count()+ Reports.find({
            "editedBy": currentRow._id
        }).count();
        const total = branches + carriers + circulars + incidents + invoices + parameters + reports;
        if (total === 0) {
            return "<a href='#' id='" + currentRow._id + "' name='remove' class='glyphicon glyphicon-trash js-remove' style='text-decoration:none;color:black;margin-left:2px;'></a>";
        }
    };
    return null;
};

const dtOptions = {
    columns: [{
        title: 'Username',
        data: 'username',
        className: '',
    }, {
        title: 'Full Name',
        data: 'profile.name',
        className: '',
    }, {
        title: 'Branch',
        data: function(row) {
            const profile = row.profile;
            const id = profile.branch;
            const branch = Branches.findOne(id);
            return branch.codeName;
        },
        className: '',
    }, {
        title: 'E-mail',
        data: 'profile.email',
        className: '',
    }, {
        title: 'Profile',
        data: 'profile.access',
        className: '',
    }, {
        title: 'Status',
        data: 'profile.status',
        className: 'floatCenter',
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderEditObject,
    }, {
        title: '',
        className: "details-control",
        orderable: false,
        data: null,
        render: renderRemoveObject,
    }, ],
    "columnDefs": [{
        "width": "15%",
        "targets": 0
    }, {
        "width": "25%",
        "targets": 1
    }, {
        "width": "20%",
        "targets": 2
    }, {
        "width": "20%",
        "targets": 3
    }, {
        "width": "10%",
        "targets": 4
    }, {
        "width": "10%",
        "targets": 5
    }, {
        "width": "0.1%",
        "targets": 6
    }, {
        "width": "0.1%",
        "targets": 7
    }, ],
    searching: false,
    autoWidth: true,
    "responsive": true,
    "stateSave": true,
    "language": {
        "lengthMenu": dt_EN.lengthMenu,
        "zeroRecords": dt_EN.zeroRecords,
        "info": dt_EN.info,
        "infoEmpty": dt_EN.infoEmpty,
        "infoFiltered": dt_EN.infoFiltered,
        "paginate": {
            "first": dt_EN.paginate.first,
            "last": dt_EN.paginate.last,
            "next": dt_EN.paginate.next,
            "previous": dt_EN.paginate.previous,
        },
    },
    "dom": '<"top">rt<"bottom"lip><"clear">',
    "pagingType": "full_numbers",
};

Template.User.created = function() {
    Meteor.subscribe("users");
    Meteor.subscribe("branches");
};

Template.User.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
    $("table").css("width", "auto");
    $(inputName).inputmask({
        mask: "[A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}]",
        definitions: {
            'A': {
                validator: "[A-Za-z]",
                casing: "upper"
            },
            'a': {
                validator: "[A-Za-z]",
                casing: "lower"
            },
            '_': {
                validator: "[ ]",
            },
        },
        placeholder: "",
    });
    const input01 = document.getElementById('inputName');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputBranch');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputUsername');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputEmail');
    input04.autocomplete = 'off';
};

Template.User.helpers({
    object: object,
    reactiveDataFunction: function() {
        return dtData;
    },
    dtOptions: dtOptions,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
            }, ]
        };
    },
    profiles: profiles,
    statuses: statuses,
    hasAccessProfile: function(){
        let access = false;
        if (Meteor.user().profile.access === "ADMIN"){
            access = true;
        };
        return access;
    },
});

Template.User.events({
    'click #btnNew': function(event) {
        const ref = object.new;
        Session.set('activeModal', ref);
    },
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click .js-edit': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        popup.popupId = id;
        const href = $(e.target).attr("data-page");
        const user = Meteor.users.findOne(id);
        const branch = Branches.findOne(user.profile.branch);
        activeObject = {
            userName: user.profile.name,
            userUsername: user.username,
            userEmail: user.profile.email,
            userBranch: branch.codeName,
            userProfile: user.profile.access,
            userStatus: user.profile.status,
        };
        Session.set('activeModal', href);
    },
    'click .js-remove': function(e, t) {
        e.preventDefault();
        const id = $(e.target).attr('id');
        const user = Meteor.users.findOne(id);
        popup.type = "userDel";
        popup.title = "Remove " + objectName;
        popup.message = "Do you really wish to remove the register?";
        popup.no = "Cancel";
        popup.yes = "Yes, remove";
        popup.popupId = id;
        Modal.show('popup');
    },
    'submit form': function(event) {
        event.preventDefault();
        const name = $(inputName).val();
        const username = $(inputUsername).val();
        const email = $(inputEmail).val();
        const branch = $(inputBranch).val();
        const profile = $(inputProfile).val();
        const status = $(inputStatus).val();
        const users = dtData();
        $("table[id*='DataTables']").dataTable().fnClearTable();
        for (var i = 0; i < users.length; i++) {
            var object = users[i];
            var criteria = true;
            if (name != "") {
                if (object.profile.name.toUpperCase().includes(name.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (username != "") {
                if (object.username.toUpperCase().includes(username.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (email != "") {
                if (object.profile.email.toUpperCase().includes(email.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (branch != "") {
                const branchId = Branches.findOne({
                    "codeName": branch
                });
                if (object.profile.branch == branchId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (profile != "") {
                if (object.profile.access == profile) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (status != "") {
                if (object.profile.status == status) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                $("table[id*='DataTables']").dataTable().fnAddData(
                    object
                );
            };
        };
        return false;
    },
    'click #btnExport': function(event) {
        event.preventDefault();
        const name = $(inputName).val();
        const username = $(inputUsername).val();
        const email = $(inputEmail).val();
        const branch = $(inputBranch).val();
        const profile = $(inputProfile).val();
        const status = $(inputStatus).val();
        const users = dtData();
        var exportList = [];
        var obj = {};
        var q = 0;
        obj = {
            Username: "Username",
            Name: "Name",
            Email: "Email",
            Profile: "Profile",
            Branch: "Branch",
            Status: "Status",
        };
        exportList.push(obj);
        for (var i = 0; i < users.length; i++) {
            var object = users[i];
            var criteria = true;
            if (name != "") {
                if (object.profile.name.toUpperCase().includes(name.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (username != "") {
                if (object.username.toUpperCase().includes(username.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (email != "") {
                if (object.profile.email.toUpperCase().includes(email.toUpperCase())) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (branch != "") {
                const branchId = Branches.findOne({
                    "codeName": branch
                });
                if (object.profile.branch == branchId._id) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (profile != "") {
                if (object.profile.access == profile) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (status != "") {
                if (object.profile.status == status) {
                    criteria = criteria && true;
                } else {
                    criteria = criteria && false;
                };
            };
            if (criteria) {
                obj = {
                    Username: object.username,
                    Name: object.profile.name,
                    Email: object.profile.email,
                    Profile: object.profile.access,
                    Branch: (Branches.findOne(object.profile.branch)).codeName,
                    Status: object.profile.status,
                };
                exportList.push(obj);
                q++;
            };
        };
        if (q > 0) {
            JSONToCSVConvertor(exportList, "Users");
            alert.type = "alert-success";
            alert.message = "The " + objectName + " List was successfully exported with " + q + " register(s)."
            showHideAlert(alertClass);
        } else {
            alert.type = "alert-warning";
            alert.message = "There is NO register matching your criteria. Please verify and try again.";
            showHideAlert(alertClass);
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.UserNew.created = function() {
    Meteor.subscribe("branches");
};

Template.UserNew.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleNew).addClass("active");
    $(inputName).inputmask({
        mask: "[A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}]",
        definitions: {
            'A': {
                validator: "[A-Za-z]",
                casing: "upper"
            },
            'a': {
                validator: "[A-Za-z]",
                casing: "lower"
            },
            '_': {
                validator: "[ ]",
            },
        },
        placeholder: "",
    });
    const input01 = document.getElementById('inputName');
    input01.autocomplete = 'off';
    const input02 = document.getElementById('inputBranch');
    input02.autocomplete = 'off';
    const input03 = document.getElementById('inputUsername');
    input03.autocomplete = 'off';
    const input04 = document.getElementById('inputEmail');
    input04.autocomplete = 'off';
};

Template.UserNew.helpers({
    object: object,
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
                filter: {
                    status: "ACTIVE"
                }
            }, ]
        };
    },
    profiles: profiles,
    statuses: statuses,
});

Template.UserNew.events({
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click #btnCancel': function(event) {
        const name = $(inputName).val();
        const branch = $(inputBranch).val();
        const username = $(inputUsername).val();
        const email = $(inputEmail).val();
        const profile = $(inputProfile).val();
        popup.back = objectName;
        if (name != "" || branch != "" || username != "" || email != "" || profile != "") {
            popup.type = "userNew_Back";
            popup.title = "Exit without Saving";
            popup.message = "Do you really wish to quit without saving?";
            popup.no = "Cancel";
            popup.yes = "Yes, exit";
            popup.popupId = "";
            Modal.show('popup');
        } else {
            Session.set('activeModal', popup.back);
        };
        return false;
    },
    'submit form': function(event) {
        event.preventDefault();
        popup.back = objectName;
        const name = $(inputName).val();
        const branch = $(inputBranch).val();
        const username = $(inputUsername).val();
        const email = $(inputEmail).val();
        const profile = $(inputProfile).val();
        if (name != "" && branch != "" && username != "" && email != "" && profile != "") {
            const branchAux = Branches.findOne({
                "codeName": branch
            });
            if (!branchAux) {
                alert.type = "alert-warning";
                alert.message = "The typed Branch does NOT exist. You must pick an option from the autocomplete list.";
                showHideAlert(alertClass);
                return false;
            };
            popup.type = "userNew_Save";
            popup.title = "Save new " + objectName;
            popup.message = "Do you really wish to save this new " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, save";
            const nameAux = Meteor.users.find({
                "profile.name": name
            }).count();
            const usernameAux = Meteor.users.find({
                "username": username
            }).count();
            const emailAux = Meteor.users.find({
                "profile.email": email
            }).count();
            popupAux.old = nameAux + usernameAux + emailAux;
            popupAux.param1 = name;
            popupAux.param2 = branchAux._id;
            popupAux.param3 = username;
            popupAux.param4 = email;
            popupAux.param5 = profile;
            Modal.show('popup');
        };
        return false;
    },
});

////////////////////////////////////////////////////////////////////////////////

Template.UserEdit.created = function() {
    Meteor.subscribe("users");
    Meteor.subscribe("branches");
};

Template.UserEdit.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html("<a href='#'>" + objectName + "</a>").removeClass("active");
    $("#bread_4").show().html(object.titleEdit).addClass("active");
    $(inputProfile).val(activeObject.userProfile);
    $(inputStatus).val(activeObject.userStatus);
    $(inputName).inputmask({
        mask: "[A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}][A{1}a{*}_{1}]",
        definitions: {
            'A': {
                validator: "[A-Za-z]",
                casing: "upper"
            },
            'a': {
                validator: "[A-Za-z]",
                casing: "lower"
            },
            '_': {
                validator: "[ ]",
            },
        },
        placeholder: "",
    });
    const input01 = document.getElementById('inputBranch');
    input01.autocomplete = 'off';
};

Template.UserEdit.helpers({
    object: object,
    statuses: statuses,
    profiles: profiles,
    activeObject() {
        return activeObject
    },
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                collection: Branches,
                field: "codeName",
                template: Template.ac_Branch,
                matchAll: true,
                filter: {
                    status: "ACTIVE"
                }
            }, ]
        };
    },
});


Template.UserEdit.events({
    'click #btnClear': function(event) {
        form.reset();
        return false;
    },
    'click #btnCancel': function(event) {
        const name = $(inputName).val();
        const username = $(inputUsername).val();
        const email = $(inputEmail).val();
        const branch = $(inputBranch).val();
        const profile = $(inputProfile).val();
        const status = $(inputStatus).val();
        popup.back = objectName;
        if (name != activeObject.userName || username != activeObject.userUsername || email != activeObject.userEmail || branch != activeObject.userBranch || profile != activeObject.userProfile || status != activeObject.userStatus) {
            popup.type = "userEdit_Back";
            popup.title = "Exit without Saving";
            popup.message = "Do you really wish to quit without saving?";
            popup.no = "Cancel";
            popup.yes = "Yes, exit";
            popup.popupId = "";
            Modal.show('popup');
        } else {
            Session.set('activeModal', popup.back);
        };
    },
    'submit form': function(event) {
        event.preventDefault();
        popup.back = objectName;
        const name = $(inputName).val();
        const username = $(inputUsername).val();
        const email = $(inputEmail).val();
        const branch = $(inputBranch).val();
        const profile = $(inputProfile).val();
        const status = $(inputStatus).val();
        if (name == activeObject.userName && username == activeObject.userUsername && email == activeObject.userEmail && branch == activeObject.userBranch && profile == activeObject.userProfile && status == activeObject.userStatus) {
            alert.type = "alert-warning";
            alert.message = username.toUpperCase() + " was NOT saved because there is NO CHANGES to its register. Please verify and try again.";
            showHideAlert(alertClass);
        } else if (name != "" && username != "" && email != "" && branch != "" && profile != "" && status != "") {
            if (branch != activeObject.branch && Branches.findOne({
                    "codeName": branch
                }).status != "ACTIVE") {
                alert.type = "alert-danger";
                alert.message = branch + " is inactive therefore you can NOT use it. Please verify and try again.";
                showHideAlert(alertClass);
                return false;
            };
            popup.type = "userEdit_Save";
            popup.title = "Update " + objectName;
            popup.message = "Do you really wish to update this " + objectName + "?";
            popup.no = "Cancel";
            popup.yes = "Yes, update";
            const branchAux = Branches.findOne({
                "codeName": branch
            });
            var count = 0;
            if (name != activeObject.userName) {
                const oldName = Meteor.users.find({"profile.name":name}).count();
                count += oldName;
            };
            if (username != activeObject.userUsername) {
                const oldUsername = Meteor.users.find({"username":username}).count();
                count += oldUsername;
            };
            if (email != activeObject.userEmail) {
                const oldEmail = Meteor.users.find({"profile.email":email}).count();
                count += oldEmail;
            };
            popupAux.old = count;
            popupAux.param1 = name;
            popupAux.param2 = username;
            popupAux.param3 = email;
            popupAux.param4 = profile;
            popupAux.param5 = branchAux._id;
            popupAux.param6 = status;
            Modal.show('popup');
        };
    },
});
