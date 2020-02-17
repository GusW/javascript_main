import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

export const PaymentMethods = new Mongo.Collection('paymentMethods');

if(Meteor.isServer){
    Meteor.publish('paymentMethods', function paymentMethodsPublication() {
        return PaymentMethods.find();
    });
};

Meteor.methods({
    'paymentMethods.removeAll' () {
        PaymentMethods.remove({});
    },
    'paymentMethods.fetchAPI' (){
        const version = "v0";
        const host = "http://staging.segurospromo.com.br";
        const url = host + "/" + version + "/paymentmethod";
        let result = HTTP.get(url, {
                   headers: {
                       Authorization: "Basic aWxsYWdlcjpldm9rZXJAMTEx",
                   }
        });
        const results = result.data;
        let avaliable_methods = results.avaliable_methods;
        let creditcard_brands = results.creditcard_brands;
        if(PaymentMethods.find({
          avaliable_methods: avaliable_methods,
          creditcard_brands: creditcard_brands,
          }).count() === 0){
            PaymentMethods.insert({
              avaliable_methods: avaliable_methods,
              creditcard_brands: creditcard_brands,
            });
        }
    },
});
