const axios = require('axios');

var encodedAddress = '11070240';
var geocodeURL = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodedAddress;

axios.get(geocodeURL).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to find this address!');
  }

  var latitude = response.data.results[0].geometry.location.lat;
  var longitude = response.data.results[0].geometry.location.lng;
  var weatherURL = 'https://api.darksky.net/forecast/d8cbd94997d426e29804837c7559a1e6/' + latitude + ',' + longitude + '?units=si&lang=pt';
  console.log(weatherURL);
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherURL);

}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`A temperature é de ${temperature}, mas a sensação é de ${apparentTemperature}`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers!');
  } else {
    console.log(e.message);
  }
});
