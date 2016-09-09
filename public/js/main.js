$(document).ready(function() {

  console.log('script loaded')



/////////////Geocoder//////////////

// var NodeGeocoder = require('node-geocoder');

// var options = {
//   provider: 'google',
//   // Optional depending on the providers
//   httpAdapter: 'https', // Default
//   apiKey: 'AIzaSyDPMSlU4RW9QMz8ceTsBbBevwtLJvOLDAQ', // for Mapquest, OpenCage, Google Premier
//   formatter: null         // 'gpx', 'string', ...
// };

// var geocoder = NodeGeocoder(options);
// // Using callback
// geocoder.geocode('303 w 120th street, new york ny', function(err, res) {
//   console.log(res);
// });

//////////////////NYC OPENDATA///////////////////

  var root = 'https://data.cityofnewyork.us/resource/dvh8-u7es.json?$where=within_circle(location_1,%2040.762027813,%20-73.999059288,%20200)and%20occurrence_year%20=%202015';

  $.ajax({
    dataType: 'json',
    url: root,
    method: 'GET'
  }).then(function(data) {
    console.log(data)
  });

//////////////SKETCH CALCULATOR////////////////


});
