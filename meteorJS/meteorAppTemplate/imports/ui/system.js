let dateFormat = require('dateformat');

system = {
    name: "gusw:meteorAppTemplate",
    version: "v.1.0.0",
    description: "Enterprise Meteor App - gustavo.watanabe@gmail.com",
    logo: "logo2.png",
    alt: "System Logo",
    href: "Home",
    width: "10em",
    marginTop: "-1em",
    marginLeft: "-0.4em",
    user(){
        return Meteor.user();
    },
    username() {
        return system.user().username;
    },
    now() {
        return dateFormat(new Date(), "dddd, mmmm dS yyyy, HH:MM:ss");
    },
};
