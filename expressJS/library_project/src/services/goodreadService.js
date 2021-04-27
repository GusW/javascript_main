const axios = require('axios');
const debug = require('debug')('app:goodreadService');
const xml2js = require('xml2js');

const parser = xml2js.Parser({ explicityArray: false });

const goodreadService = () => {
  const getBookById = (id) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    new Promise((resolve, reject) => {
      try {
        axios
          .get('https://www.w3schools.com/xml/plant_catalog.xml')
          .then((response) => {
            parser.parseString(response.data, (err, result) => {
              if (err) {
                debug(err);
              } else {
                debug(result);
                resolve({ description: result.CATALOG.PLANT[0].BOTANICAL });
              }
            });
          });
      } catch (error) {
        reject(error);
        debug(error);
      }
    });
  return { getBookById };
};

module.exports = goodreadService();
