import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

export const Quotations = new Mongo.Collection('quotations');

export const QuotationsLast = new Mongo.Collection('quotationsLast');

if(Meteor.isServer){
    Meteor.publish('quotations', function quotationsPublication() {
        return Quotations.find();
    });

    Meteor.publish('quotationsLast', function quotationsLastPublication() {
        return QuotationsLast.find();
    });
};

Meteor.methods({
    'quotations.removeAll'(){
        Quotations.remove({});
    },
    'quotations.fetchAPI' (opening, closing, destination){
        let quotations = [];
        const version = "v0";
        const host = "http://staging.segurospromo.com.br";
        const url = host + "/" + version + "/quotations";
        let result = HTTP.post(url, {
                   headers: {
                       Authorization: "Basic aWxsYWdlcjpldm9rZXJAMTEx",
                   },
                   data: {
                      "begin_date": opening,
                      "end_date": closing,
                      "destination": destination,
                   },
        });
        const results = result.data;
        let Percentual = 0 / results.length;
        for (let r = 0; r < results.length; r++){
            const provider = results[r].provider_name;
            const providerC = results[r].provider_code;
            const name = results[r].name;
            const code = results[r].code;
            const benefits = results[r].benefits;
            const elderP = results[r].elder.price;
            const elderPwC = results[r].elder.price_wo_commission;
            const elderMin = results[r].elder.min_age;
            const elderMax = results[r].elder.max_age;
            const adultP = results[r].adult.price;
            const adultPwC = results[r].adult.price_wo_commission;
            const adultMin = results[r].adult.min_age;
            const adultMax = results[r].adult.max_age;
            const childP = results[r].child.price;
            const childPwC = results[r].child.price_wo_commission;
            const childMin = results[r].child.min_age;
            const childMax = results[r].child.max_age;
            const object = {
                provider_code: providerC,
                provider_name: provider,
                name: name,
                code: code,
                benefits: benefits,
                adult:
                  { price: adultP,
                  price_wo_commission: adultPwC,
                  min_age: adultMin,
                  max_age: adultMax },
                child:
                  { price: childP,
                    price_wo_commission: childPwC,
                    min_age: childMin,
                    max_age: childMax },
                elder:
                  { price: elderP,
                    price_wo_commission: elderPwC,
                    min_age: elderMin,
                    max_age: elderMax },
            };
            quotations.push(object);
            Percentual = ((r / results.length)/3)*100;
        };
        for (let q = 0; q < quotations.length; q++){
            const quotation = quotations[q];
            const urlProduct = host + "/" + version + "/products/" + quotation.code;
            const resultProduct = HTTP.get(urlProduct, {
                       headers: {
                           Authorization: "Basic aWxsYWdlcjpldm9rZXJAMTEx",
                       },
            });
            quotation.benefits = resultProduct.data;
            Percentual += ((q/ quotations.length)/3)*100;
        }
        for (let q1 = 0; q1 < quotations.length; q1++){
            const quotation = quotations[q1];
            Quotations.insert({
                provider_code: quotation.provider_code,
                provider_name: quotation.provider_name,
                name: quotation.name,
                code: quotation.code,
                benefits: quotation.benefits,
                adult:
                  { price: quotation.adult.price,
                  price_wo_commission: quotation.adult.price_wo_commission,
                  min_age: quotation.adult.min_age,
                  max_age: quotation.adult.max_age },
                child:
                  { price: quotation.child.price,
                  price_wo_commission: quotation.child.price_wo_commission,
                  min_age: quotation.child.min_age,
                  max_age: quotation.child.max_age },
                elder:
                  { price: quotation.elder.price,
                  price_wo_commission: quotation.elder.price_wo_commission,
                  min_age: quotation.elder.min_age,
                  max_age: quotation.elder.max_age },
            });
            Percentual += ((q1/ quotations.length)/3)*100;
        };
        return 100;
    },
    'quotationsLast.removeAll'(){
        QuotationsLast.remove({});
    },
    'quotationsLast.insert'(dest, begin, end){
        QuotationsLast.insert({
          destination: dest,
          begin: begin,
          end: end,
        });
    },
});
