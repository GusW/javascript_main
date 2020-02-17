import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

export const Purchases = new Mongo.Collection('purchases');
export const PurchasesInfo = new Mongo.Collection('purchasesInfo');
export const PurchasesLast = new Mongo.Collection('purchasesLast');

if(Meteor.isServer){
    Meteor.publish('purchases', function purchasesPublication() {
        return Purchases.find();
    });
    Meteor.publish('purchasesInfo', function purchasesInfoPublication() {
        return PurchasesInfo.find();
    });
    Meteor.publish('purchasesLast', function purchasesLastPublication() {
        return PurchasesLast.find();
    });
};

Meteor.methods({
    'purchases.removeAll' () {
        Purchases.remove({});
    },
    'purchases.fetchAPI' (begin, end){
        const version = "v0";
        const host = "http://staging.segurospromo.com.br";
        const url = host + "/" + version + "/purchases";
        let result = HTTP.get(url, {
                   headers: {
                       Authorization: "Basic aWxsYWdlcjpldm9rZXJAMTEx",
                   },
                   params: {
                       begin: String(begin),
                       end: String(end),
                   },
        });
        const purchases = result.data;
        for (let r = 0; r < purchases.length; r++){
          let purchaseId = purchases[r].id;
          let status = purchases[r].status;
          let price = purchases[r].price;
          let created_at = purchases[r].created_at;
          let destination = purchases[r].destination;
          let coverage_begin = purchases[r].coverage_begin;
          let coverage_end = purchases[r].coverage_end;
          let details = purchases[r].details;
          if(Purchases.find({
            "purchaseId": purchaseId,
            "status": status,
            "price": price,
            "created_at": created_at,
            "destination": destination,
            "coverage_begin": coverage_begin,
            "coverage_end": coverage_end,
          }).count() === 0){
            Purchases.insert({
              "purchaseId": purchaseId,
              "status": status,
              "price": price,
              "created_at": created_at,
              "destination": destination,
              "coverage_begin": coverage_begin,
              "coverage_end": coverage_end,
              "details": details,
            });
          }
        };
        return 100;
    },
    'purchasesLast.removeAll' () {
        PurchasesLast.remove({});
    },
    'purchasesLast.insert' (begin, end) {
        PurchasesLast.insert({
          begin: begin,
          end: end,
        });
    },
    'purchases.newAPI' (merchant_purchase_id, product_code, destination, coverage_begin, coverage_end, payment_method, price, parcels, holder_full_name, holder_cpf, insureds_merchant_insured_id, insureds_document, insureds_document_type, insureds_full_name, insureds_birth_date, creditcard_expiration_year, creditcard_expiration_month, creditcard_cvv, creditcard_brand, creditcard_number){
        const version = "v0";
        const host = "http://staging.segurospromo.com.br";
        const url = host + "/" + version + "/purchases";
        let result = HTTP.post(url, {
                    headers: {
                        Authorization: "Basic aWxsYWdlcjpldm9rZXJAMTEx",
                    },
                   data: {
                     "merchant_purchase_id": merchant_purchase_id,
                     "product_code": product_code,
                     "destination": destination,
                     "coverage_begin": coverage_begin,
                     "coverage_end": coverage_end,
                     "payment_method": payment_method,
                     "price": price,
                     "parcels": parcels,
                     "holder": {
                       "full_name": holder_full_name,
                       "cpf": holder_cpf,
                     },
                     "insureds": [{
                       "merchant_insured_id": insureds_merchant_insured_id,
                       "document": insureds_document,
                       "document_type": insureds_document_type,
                       "full_name": insureds_full_name,
                       "birth_date": insureds_birth_date,
                     },],
                     "creditcard": {
                       "expiration_year": creditcard_expiration_year,
                       "expiration_month": creditcard_expiration_month,
                       "cvv": creditcard_cvv,
                       "brand": creditcard_brand,
                       "number": creditcard_number,
                     }
                   },
        });
        return result.data;
    }
});
