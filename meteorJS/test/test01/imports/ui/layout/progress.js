import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import './progress.html';

Percentual = 100;

showHideProgress = function(Percentual) {
    if (Percentual === 100){
      $(".progress").hide();
    }
};

Template.progress.helpers({
    Percentual:Percentual,
});

Template.progressView.helpers({
    Percentual:Percentual,
});
