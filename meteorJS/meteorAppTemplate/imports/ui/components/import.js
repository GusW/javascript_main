import './import.html';
import './shared.js';
import '../layout/popup.js';
import '../layout/alert.js';

const objectName = "Import";

var object = {
    name: objectName,
    menu: "Settings",
    title: objectName + " Data",
    type: "Type",
    inputType: "inputType",
    file: "File",
    inputFile: "inputFile",
};

const alertClass = $(".alert");
const inputType = "#" + object.inputType;
const inputFile = "#" + object.inputFile;

Template.Import.rendered = function() {
    $("#bread_2").show().html(object.menu);
    $("#bread_3").show().html(object.title).addClass("active");
    $("#bread_4").hide();
};


Template.Import.helpers({
    object: object,
    importTypes: importTypes,
    hasAccessProfile: function(){
        let access = true;
        if (Meteor.user().profile.access === "AUDIT"){
            access = false;
        }
        return access;
    },
    accessType: function(key) {
        let enabledType;
        const accessProfile = Meteor.user().profile.access;
        if (accessProfile === "AUDIT"){
            enabledType = "disabled";
        } else if (accessProfile === "INCIDENTS") {
            if (key === "INCIDENTS"){
                enabledType = "";
            } else {
                enabledType = "disabled";
            }
        } else if (accessProfile === "REPORTS") {
            if (key === "CIRCULARS"){
                enabledType = "";
            } else {
                enabledType = "disabled";
            }
        } else {
            enabledType = "";
        }
        return enabledType;
    },
});

Template.Import.events({
  'click #btnClear':function(event){
      $(inputType).val("");
      $(inputFile).val("");
      return false;
  },
  'submit form':function(event){
      const type = $(inputType).val();
      fileInput = document.getElementById('inputFile');
      const file = fileInput.files[0];
      popup.type = "import" + type;
      popup.title = "Import " + type.toLowerCase();
      popup.message = "Do you really wish to import the " + type.toLowerCase() + " list?";
      popup.no = "Cancel";
      popup.yes = "Yes, import";
      Modal.show('popup');
      return false;
   },
});
