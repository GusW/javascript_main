import axios from 'axios';

interface customAPIInterface {
  URL: string;
  location: string;
}

const customAPI: customAPIInterface = {
  URL: 'http://maps.googleapis.com/maps/api/geocode/json',
  location: 'maracana rio de janeiro'
};

const pingFrontendAPI = async () => {
  try {
    return await axios
      .get(customAPI.URL, {
        params: {
          address: customAPI.location
        }
      })
      .then(function (response) {
        console.log(response);
      });
  } catch (exception) {
    console.error(exception);
  }
};

export default pingFrontendAPI;
