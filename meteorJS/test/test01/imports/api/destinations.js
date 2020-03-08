import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

export const Destinations = new Mongo.Collection('destinations');

if(Meteor.isServer){
    Meteor.publish('destinations', function destinationsPublication() {
        return Destinations.find();
    });
};

Meteor.methods({
    'destinations.insert' (slug, name) {
        Destinations.insert({
            slug: slug,
            name: name,
        });
    },
    'destinations.removeAll' () {
        Destinations.drop();
    },
    'destinations.fetchAPI' (){
        const version = "v0";
        const host = "http://staging.segurospromo.com.br";
        const url = host + "/" + version + "/additional-info/destinations";
        let result = HTTP.get(url, {
                   headers: {
                       Authorization: "Basic aWxsYWdlcjpldm9rZXJAMTEx",
                   }
        });
        const results = result.data;
        for (let r = 0; r < results.length; r++){
          let slug = results[r].slug;
          let name = results[r].name;
          if(Destinations.find({
            slug: slug,
            name: name
          }).count() === 0){
            Destinations.insert({
              slug: slug,
              name: name,
            });
          }
        };
    },
});
